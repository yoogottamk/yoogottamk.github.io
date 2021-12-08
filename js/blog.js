const e=[{id:"/blog/aoc-2021-bash",tags:["bash","aoc"],title:"AoC 2021 in bash",content:"I feel AoC is a nice way to get to know the language of your choice. There’s string manipulation, basic mathematics and more. bash isn’t the ideal language for this task because (in my opinion) it wasn’t meant to solve these kind of problems. Nevertheless, I wanted to expand my experience with bash and so I’ll attempt to solve all the AoC problems using this language. I might not be able to solve the problems on the same day (heck, I’m starting almost a week late) and might even skip some problems altogether. I also plan to use common tools like grep, sed, awk, etc and not rely on pure bash. Index  Day 01 part 1 part 2 Day 02 part 1 part 2 Day 03 part 1 part 2  · · · Day 01 Part 1 First, let’s get the first value and setup variables prev_value=&quot;$(head -1 $INP_FILE)&quot; # keep count in this variable inc_count=0 # store input file in a variable INP_FILE=&quot;../inp/1&quot;  Now, skipping the first line, we need to iterate over the rest and count the changes sed -n &#39;2,$p&#39; &quot;$INP_FILE&quot; | while read value; do (( value &amp;gt; prev_value )) &amp;amp;&amp;amp; (( inc_count++ )) prev_value=$value done  Finally, lets print the answer echo $inc_count # Output: 0  WRONG ANSWER. Umm… what?! After opening the file and confirming that the answer indeed isn’t 0, I decided to do some print debugging… sed -n &#39;2,$p&#39; &quot;$INP_FILE&quot; | while read value; do (( value &amp;gt; prev_value )) &amp;amp;&amp;amp; (( inc_count++ )) echo $inc_count prev_value=$value done  …and surely, non zero values were being printed: ... 1398 1399 1400 1400  This confirmed my doubt that the piped while loop was actually running inside a subshell. A fix, also mentioned in the post was to wrap the while loop and echo inside braces to make it be processed by the same subshell. sed -n &#39;2,$p&#39; &quot;$INP_FILE&quot; | { while read value; do (( value &amp;gt; prev_value )) &amp;amp;&amp;amp; (( inc_count++ )) prev_value=$value done echo $inc_count }  Note that the variable originally declared outside is still 0. Part 2 Firstly, I’ll make a function, part1 that solves part 1. It’ll accept a single argument: a filename which has the numbers We’re going to use paste and process substitution to calculate the window sum. A little bit of background first: we want to offset the stream of numbers and want to see them side by side, very much like the illustration provided on the website: 199 A 200 A B 208 A B C 210 B C D 200 E C D 207 E F D 240 E F G 269 F G H 260 G H 263 H  Using paste, we can merge two numbers from the lines together: paste &amp;lt;(seq 1 5) &amp;lt;(seq 1 5) # Output: 1 1 2 2 3 3 4 4 5 5  We can achieve the offset simply by using echo. Also, changing delimiter to + paste -d+ &amp;lt;(seq 1 5) &amp;lt;(echo; seq 1 5) # Output: 1+ 2+1 3+2 4+3 5+4 +5  Passing this to bc will give us the sum for valid windows and print (standard_in) [NUMBER]: syntax error to stderr, which will get ignored anyways ;) Putting it all together: tmpfile=&quot;$(mktemp)&quot; # calculate sum of 3-interval window # NOTE: numbers not part of a window will get ignored anyways paste -d+ &quot;$INP_FILE&quot; &amp;lt;(echo; cat &quot;$INP_FILE&quot;) &amp;lt;(echo; echo; cat &quot;$INP_FILE&quot;) | bc &amp;gt; &quot;$tmpfile&quot; 2&amp;gt;/dev/null part1 &quot;$tmpfile&quot; rm &quot;$tmpfile&quot;  · · · Day 02 There was nothing surprising or special about my solution for Day 02 so I’ll just put them here: Part 1 function part1 { horizontal=0 depth=0 while read directive value; do case $directive in forward) (( horizontal += value )) ;; down) (( depth += value )) ;; up) (( depth -= value )) ;; esac done &amp;lt; &quot;$INP_FILE&quot; echo $(( horizontal * depth )) }  Part 2 function part2 { horizontal=0 depth=0 aim=0 while read directive value; do case $directive in forward) (( horizontal += value )) (( depth += value * aim )) ;; down) (( aim += value )) ;; up) (( aim -= value )) ;; esac done &amp;lt; &quot;$INP_FILE&quot; echo $(( horizontal * depth )) }  · · · Day 03 Part 1 First, I’ll define a few global variables that’ll come handy in the solution. INP_FILE, like all other solutions and N_COLS. Since the number of columns in each line is fixed, we can simply check the characters in the first line and remove 1 for the newline character. # this counts the newline too N_COLS=&quot;$( head -1 &quot;$INP_FILE&quot; | wc -c )&quot; # account for that (( N_COLS-- ))  With that done, I define a helper function that takes a file and calculates each columns’ sum (actually, it counts the number of lines that have a 1 at that place). I use cut to only look at that specific column. function count_set_bits { # count set bits at each position set_bit_counts=() for (( i=1; i &amp;lt;= N_COLS; i++)); do set_bit_counts+=(&quot;$( cut -c $i &quot;$1&quot; | grep 1 | wc -l )&quot;) done # &quot;return&quot; the bit count echo &quot;${set_bit_counts[@]}&quot; }  This will contain the number of rows that have 1 at those columns. Now, part 1 is trivial: function part1 { set_bit_counts=($( count_set_bits &quot;$1&quot; )) # use redirection to avoid filename n=&quot;$( wc -l &amp;lt; &quot;$1&quot; )&quot; gamma=0 epsilon=0 for (( i=0; i &amp;lt; N_COLS; i++ )); do (( set_bit_counts[i] &amp;gt; n - set_bit_counts[i] )) &amp;amp;&amp;amp; majority_bit=1 || majority_bit=0 (( gamma = 2 * gamma + majority_bit )) (( epsilon = 2 * epsilon + 1 - majority_bit )) done echo $(( gamma * epsilon )) }  Part 2 For part 2, we need to continuously filter the list until only one remains. Since the core logic for calculating for Oxygen and Carbon Dioxide is the same, I’ll only explain one here. I’m going to use intermediate files again. This is definitely possible to do without files but this just makes it a little easier. Basic setup o2_candidates=&quot;$( cat &quot;$1&quot; )&quot; tmpfile=`mktemp` # for keeping track of which bits we&#39;ve already seen cur_bit=0  Counting current number of candidates Since the number of rows are changing at every step, we need to keep track of the current count. We also need to recalculate column sum at every step. The sum part is simple because of the function declared earlier (count_set_bits) To get the count of candidates remaining, we can use wc: wc -l &amp;lt;&amp;lt;&amp;lt; &quot;$o2_candidates&quot;  Filtering candidates The other part of the puzzle is only keeping lines that we want to. This can be achieved by grep. When we’re looking at the ith column, the first i-1 columns can be anything (“.” in regex). So, for example if I want my 6th character to be Y and don’t care about anything else, I’ll use the following regex: grep -E &quot;^.{5}Y&quot;  For this problem, filtering candidates looks like: # ignore for `cur_bit` characters (0 indexed so -1 offset not needed) # and then look for `set_bit` o2_candidates=&quot;$( grep -E &quot;^.{$cur_bit}${reqd_bit}&quot; &amp;lt;&amp;lt;&amp;lt; &quot;$o2_candidates&quot; )&quot;  Base 2 to decimal bc has a special variable called ibase that controls the base of input. In case you were wondering, obase also exists. So, we can do math in binary and get the result in decimal. For example, multiplying 10 (1010 in binary) and 5 (101 in binary): bc &amp;lt;&amp;lt;&amp;lt; &quot;ibase=2; 1010 * 101&quot; # Output: 50  Full solution function part2 { o2_candidates=&quot;$( cat &quot;$1&quot; )&quot; co2_candidates=&quot;$( cat &quot;$1&quot; )&quot; tmpfile=`mktemp` cp &quot;$1&quot; &quot;$tmpfile&quot; cur_bit=0 while (( n=&quot;$( wc -l &amp;lt;&amp;lt;&amp;lt; &quot;$o2_candidates&quot; )&quot; )); (( n &amp;gt; 1 )); do set_bit_counts=($( count_set_bits &quot;$tmpfile&quot; )) # if number of 1s &amp;gt;= number of 0s (( set_bit_counts[cur_bit] &amp;gt;= n - set_bit_counts[cur_bit] )) &amp;amp;&amp;amp; reqd_bit=1 || reqd_bit=0 # ignore for `cur_bit` characters (0 indexed so -1 offset not needed) # and then look for `set_bit` o2_candidates=&quot;$( grep -E &quot;^.{$cur_bit}${reqd_bit}&quot; &amp;lt;&amp;lt;&amp;lt; &quot;$o2_candidates&quot; )&quot; echo &quot;$o2_candidates&quot; &amp;gt; &quot;$tmpfile&quot; (( cur_bit++ )) done # reset variables cur_bit=0 cp &quot;$1&quot; &quot;$tmpfile&quot; while (( n=&quot;$( wc -l &amp;lt;&amp;lt;&amp;lt; &quot;$co2_candidates&quot; )&quot; )); (( n &amp;gt; 1 )); do set_bit_counts=($( count_set_bits &quot;$tmpfile&quot; )) # if number of 0s &amp;gt; number of 1s (( n - set_bit_counts[cur_bit] &amp;gt; set_bit_counts[cur_bit] )) &amp;amp;&amp;amp; reqd_bit=1 || reqd_bit=0 co2_candidates=&quot;$( grep -E &quot;^.{$cur_bit}${reqd_bit}&quot; &amp;lt;&amp;lt;&amp;lt; &quot;$co2_candidates&quot; )&quot; echo &quot;$co2_candidates&quot; &amp;gt; &quot;$tmpfile&quot; (( cur_bit++ )) done echo &quot;ibase=2; $o2_candidates * $co2_candidates&quot; | bc rm &quot;$tmpfile&quot; }  · · ·  My solutions, for both bash and very little rust can be found here."},{id:"/blog/port-based-routing",tags:["networking","iptables"],title:"Port based routing",content:"Recently, my ISP started blocking outbound ssh connections[*] and that hindered my workflow a lot. The only other internet connection I had was my mobile phone’s wireless hotspot (limited data). Somehow, I need to send ONLY the ssh packets through my wireless interface. [skip to script] (*) they blocked port 22 and a few others (no deep packet inspection)  · · · The solution I’m connected to the ISP through my ethernet cable, so my wireless interface was free. Step 1: Mark packets We can use iptables to mark the tcp packets that are going through my eth interface (eno1) that have destination port 22 (ssh runs on 22 by default) sudo iptables -t mangle -I OUTPUT -o eno1 -p tcp --dport 22 -j MARK --set-mark 1  Step 2: Route packets Now that we have marked the packets, we need to make sure they go through my wireless interface (wlo1). For this, we can create a new routing table such that the default gateway is the gateway for my wireless network. (Basically, it means that all packets that use this routing table will go through my wireless network). sudo ip route add table 22 default via 192.168.0.1  Now, we just need to make sure that all marked packets use this routing table sudo ip rule add fwmark 0x1 table 22  Step 3: Fix packets Unfortunately, this setup wouldn’t work. The reason is that although those packets will now go through wlo1, the source IP is messed up (it still would be my IP on eno1 network). This will cause all packets to drop. To fix this, we can do Network Address Translation (NAT) sudo iptables -t nat -I POSTROUTING -o wlo1 -p tcp --dport 22 -j SNAT --to 192.168.0.2  This basically changes the packets source to use my IP on the wireless network (here, 192.168.0.2)  · · · Final script This script takes care of setting up the rules and deleting them when the task is done. It also figures out the gateway and device’s IP on the wireless network.       #!/bin/bash function help { &amp;gt;&amp;amp;2 echo &quot;Usage: $0 up|down&quot; exit 1 } [[ $# == 1 ]] || { help; } # `iptables -A ...` and `ip route/rule add ...` while running &quot;up&quot; # `iptables -D ...` and `ip route/rule del ...`while running &quot;down&quot; case $1 in up) ipt=&quot;-A&quot; ipr=&quot;add&quot; ;; down) ipt=&quot;-D&quot; ipr=&quot;del&quot; ;; *) help ;; esac # get wireless gateway ip wlo1gw=$( ip r | grep -Po &quot;default via K(d+.?){4} .* wlo1&quot; | cut -d&#39; &#39; -f1 ) # get my ip on this wireless nw wlo1ip=$( ip -f inet a show wlo1 | awk &#39;/inet/{ print $2 }&#39; | cut -d/ -f1 ) # any of them empty? ditch [[ -z $wlo1gw || -z $wlo1ip ]] &amp;amp;&amp;amp; { &amp;gt;&amp;amp;2 echo &quot;wlo1 down?&quot;; exit 1; } # create table which sends via wireless iface sudo ip route $ipr table 22 default via $wlo1gw # add rule for marked packets to get routed by the table above sudo ip rule $ipr fwmark 0x1 table 22 # mark ssh packets which are going out via eth iface sudo iptables -t mangle $ipt OUTPUT -o eno1 -p tcp --dport 22 -j MARK --set-mark 1 # since im going to change the iface, set source ip to that iface&#39;s ip sudo iptables -t nat $ipt POSTROUTING -o wlo1 -p tcp --dport 22 -j SNAT --to $wlo1ip  · · ·  This script, along with various other scripts config files can be found in my dotfiles repo."},{id:"/blog/vim-anywhere",tags:["vim","automation","X11"],title:"Editing in vim from anywhere*",content:"I love vim. Once you start using it (properly), you want it everywhere. The modal editing is… …wait, I don’t need to sell vim to you, you came here because you already know how great it is! (*) This should work if you are using X11. · · · How What would you do if you wanted shift what you were typing to vim? This is what comes to mind:  Copy the text Open vim and paste it there Edit Copy it to the system clipboard Paste  Hmmm. Only if I could automate this… Enter xdotool  What is xdotool? This tool lets you simulate keyboard input and mouse activity, move and resize windows, etc. It does this using X11’s XTEST extension and other Xlib functions.   Requirements  xdotool: for simulating copy/paste actions xclip: for getting/setting clipboard content  · · · Code #!/bin/bash # you can set this to the one you use TERMINAL=uxterm file=`mktemp` # a small delay is usually required when dealing with xdotool sleep 0.5s # copy whatever was selected xdotool key ctrl+c # put clipboard contents inside a file xclip -selection clipboard -o &amp;gt; $file # open preferred text editor (vim!) &quot;$TERMINAL&quot; -e &quot;$EDITOR $file&quot; # when done with editing, copy contents to clipboard xclip -selection clipboard -i &amp;lt; $file sleep 0.1s # replace the selection which was just copied xdotool key ctrl+v rm $file  How to use  Save this file somewhere and make sure it can be executed (chmod +x) If not already present, add the directory to PATH (not exactly a necessity but now it’s easier to run it manually too) Make this accessible by a keyboard shortcut. (e.g. for ubuntu) Enjoy  Now, whenever I want to edit something in vim, I select the desired portion and press the hotkey and voila, my text is in vim! Edit, save and close, and the original text gets replaced by this! i3 users A bindsym will do the job. You might want to use a terminal which you don’t use regularly and make it a floating window. Here’s what I did (i3conf): bindsym $mod+q exec vimedit for_window [class=&quot;UXTerm&quot;] floating enable  This made the script available to me with super+q. I don’t have to specify the whole path to the file since I update PATH before loading i3. · · · Demo    Your browser does not support the video tag.   · · ·  This, along with various other cool stuff can be found in my dotfiles repo. So, did you like it? Did I miss something? Did I do something in the wrong way? Please comment below and improve my knowledge!"},{id:"/blog/managing-path",tags:["PATH","GNU/Linux"],title:"How I manage PATH",content:"i use arch btw. Now that we have established that, lets see what the PATH variable is and how it works. According to linfo, PATH is an environmental variable in Linux and other Unix-like operating systems that tells the shell which directories to search for executable files (i.e., ready-to-run programs) in response to commands issued by a user. It increases both the convenience and the safety of such operating systems and is widely considered to be the single most important environmental variable.  What that roughly means is that whenever you type in a command, the shell searches for that name in all the directories present in the PATH variable. The PATH variable looks something like this: $ echo $PATH /usr/bin:/usr/sbin:/some/other/dir:...  It is a list of directories separated by `:`. The shell searches for the executable in each directory and ends the search as soon as it finds a file with the same name. That also means that the order of directories in PATH matters. · · · The usual method The “standard” way of setting the PATH, as seen in the top search result on superuser is this: $ export PATH=$PATH:/your/new/path/here  Now, this works fine when you only need to add a few directories to PATH, and you always do that in a single file at the same place. However, the most common pattern I have seen is: ... export PATH=$PATH:/your/new/path/here ... export PATH=$PATH:/another/new/path/here:/oh/and/a/second/too ... export PATH=$PATH:/here/we/go/again ...  This is bad. Updating the variable to remove a directory can be time consuming, and what if you want to give preference to a directory for an executable? You’ll have to change the order in which they are added to PATH. Doing it when your PATH updates are scattered all over the place doesn’t make it easy. Even if you write all the directories in a single line, it can get a little too long to handle sometimes: export PATH=$PATH:/your/new/path/here:/another/new/path/here:/oh/and/a/second/too:/here/we/go/again:...  · · · What I do I keep all my PATH updates in a single file and source that file in ~/.profile. That file looks like this: #!/bin/bash # directories which get prepended prepend_dirs=( &quot;$HOME/bin&quot; &quot;$HOME/projects/some-project&quot; &quot;$HOME/projects/another-one&quot; ... ) # directories which get appended append_dirs=( &quot;$HOME/.some-dir&quot; &quot;$HOME/.local/bin&quot; &quot;/usr/local/android-studio/bin&quot; &quot;$HOME/flutter/bin&quot; &quot;$HOME/.cargo/bin&quot; ... ) # generate the strings prepend_path=$(IFS=&quot;:&quot;; echo &quot;${prepend_dirs[*]}&quot;) append_path=$(IFS=&quot;:&quot;; echo &quot;${append_dirs[*]}&quot;) # wth is this?! export PATH=&quot;${prepend_path:+${prepend_path}:}$PATH${append_path:+:${append_path}}&quot;  Explanation I maintain two arrays: one for prepending and one for appending. I generate the string (prepend_path, append_path) which gets added to PATH. This does not pollute your IFS, since the whole command is ran in a subshell. Also, printing ${array[*]} expands to all elements separated by the first character of IFS, which currently is `:`. The last line is special. It could simply have been export PATH=&quot;$prepend_path:$PATH:$append_path&quot;  Although, a problem might arise when either prepend_path or append_path is empty. The final PATH might end up looking like this: :/usr/bin:/usr/sbin:...:/home/user/bin:. Solution: bash array parameter expansion  ${parameter:+word}  &amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;If parameter is null or unset, nothing is substituted, otherwise the expansion of word is substituted.  So, if either of them are empty, the corresponding `:` won’t be added. Cool! This way, you can easily add/remove directories from PATH and easily manage the order too. · · ·  This file, along with various other config files can be found in my dotfiles repo. So, did you like it? Did I miss something? Did I do something in the wrong way? Please comment below and improve my knowledge!"},{id:"/blog/under-construction",tags:[],title:"Under Construction",content:"I want to write many more articles. I will write more as soon as I get the time! Thank you for your patience!"}];function t(){let t=$("#searchBar").val().toLowerCase(),o=$("div.posts"),a=$("#not-found");if(history.replaceState(null,"",`?q=${t}`),a.html(""),o.children().each((function(){$(this).css({display:"flex"})})),!t.length)return;let i=function(t){let o=[];return e.forEach((e=>{(function(e,t){return e.title.toLowerCase().includes(t)||e.content.toLowerCase().includes(t)||e.tags.join("|").toLowerCase().includes(t)})(e,t)&&o.push(e.id)})),o}(t);i.length||a.html("No such post has been written (yet)!"),o.children().each((function(){i.includes($(this).attr("id"))||$(this).css({display:"none"})}))}document.addEventListener("DOMContentLoaded",(function(){let e=$("#searchBar"),o=new URLSearchParams(window.location.search),a=o.get("q");o.has("q")&&(e.val(a),t()),e.on("input propertychange",t)}));