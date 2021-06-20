---
layout: post
blogTitle: Port based routing
blogImage: split-path.webp
tags:
 - networking
 - iptables
credits:
  - ["Vladislav Babienko, unsplash", "https://unsplash.com/photos/KTpSVEcU0XU"]
---

Recently, my ISP started blocking outbound ssh connections[\*] and that hindered my workflow a lot. The only other internet connection I had was my mobile phone's wireless hotspot (limited data). Somehow, I need to send ONLY the ssh packets through my wireless interface. [<a href="#script">skip to script</a>]

<h2 class="section-header pt-4">(*)</h2>
they blocked port 22 and a few others (no <a href="https://www.wikiwand.com/en/Deep_packet_inspection" target="_blank" rel="noopener">deep packet inspection</a>)

<div class="py-4"></div>

{% include post-heading.html header="The solution" %}
I'm connected to the ISP through my ethernet cable, so my wireless interface was free.

<h2 class="section-header pt-4">Step 1: Mark packets</h2>
We can use iptables to mark the tcp packets that are going through my eth interface (`eno1`) that have destination port 22 (ssh runs on 22 by default)

```sh
sudo iptables -t mangle -I OUTPUT -o eno1 -p tcp --dport 22 -j MARK --set-mark 1
```

<h2 class="section-header pt-4">Step 2: Route packets</h2>
Now that we have marked the packets, we need to make sure they go through my wireless interface (`wlo1`). For this, we can create a new routing table such that the default gateway is the gateway for my wireless network. (Basically, it means that all packets that use this routing table will go through my wireless network).

```sh
sudo ip route add table 22 default via 192.168.0.1
```

Now, we just need to make sure that all marked packets use this routing table
```sh
sudo ip rule add fwmark 0x1 table 22
```

<h2 class="section-header pt-4">Step 3: Fix packets</h2>
Unfortunately, this setup wouldn't work. The reason is that although those packets will now go through `wlo1`, the source IP is messed up (it still would be my IP on `eno1` network). This will cause all packets to drop. To fix this, we can do <a href="https://www.wikiwand.com/en/Network_address_translation" rel="noopener" target="_blank">Network Address Translation (NAT)</a>

```sh
sudo iptables -t nat -I POSTROUTING -o wlo1 -p tcp --dport 22 -j SNAT --to 192.168.0.2
```

This basically changes the packets source to use my IP on the wireless network (here, `192.168.0.2`)

<span id="script" />
{% include post-heading.html header="Final script" %}
This script takes care of setting up the rules and deleting them when the task is done. It also figures out the gateway and device's IP on the wireless network.

{% include copy-code.html %}
```bash
#!/bin/bash

function help {
    >&2 echo "Usage: $0 up|down"
    exit 1
}

[[ $# == 1 ]] || { help; }

# `iptables -A ...` and `ip route/rule add ...` while running "up"
# `iptables -D ...` and `ip route/rule del ...`while running "down"
case $1 in
    up)
        ipt="-A"
        ipr="add"
        ;;
    down)
        ipt="-D"
        ipr="del"
        ;;
    *)
        help
        ;;
esac

# get wireless gateway ip
wlo1gw=$( ip r | grep -Po "default via \K(\d+\.?){4} .* wlo1" | cut -d' ' -f1 )
# get my ip on this wireless nw
wlo1ip=$( ip -f inet a show wlo1 | awk '/inet/{ print $2 }' | cut -d/ -f1 )

# any of them empty? ditch
[[ -z $wlo1gw || -z $wlo1ip ]] && { >&2 echo "wlo1 down?"; exit 1; }

# create table which sends via wireless iface
sudo ip route $ipr table 22 default via $wlo1gw
# add rule for marked packets to get routed by the table above
sudo ip rule $ipr fwmark 0x1 table 22
# mark ssh packets which are going out via eth iface
sudo iptables -t mangle $ipt OUTPUT -o eno1 -p tcp --dport 22 -j MARK --set-mark 1
# since im going to change the iface, set source ip to that iface's ip
sudo iptables -t nat $ipt POSTROUTING -o wlo1 -p tcp --dport 22 -j SNAT --to $wlo1ip
```


{% include post-heading.html header="" %}
This script, along with various other scripts config files can be found in my <a href="https://github.com/yoogottamk/dotfiles" target="_blank" rel="noopener">dotfiles</a> repo.
