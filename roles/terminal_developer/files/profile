# ~/.profile: executed by Bourne-compatible login shells.

if [ -f ~/.bashrc ]; then
	. ~/.bashrc
fi

export LANG
export LC_ALL
export LC_CTYPE
export PYTHONPATH
. ~/.vendor/base16-shell/base16-default.dark.sh
# if [[ -n "$DISPLAY" ]]; then
# 	export TERM=xterm-256color
# 	. ~/.vendor/base16-shell/base16-default.dark.sh
# fi
if [ -n "$TMUX" ] && [ -n "$DISPLAY" ]; then
	export TERM=screen-256color
fi
# 
#export EDITOR JAVA_HOME JAVA_PATH JDK_HOME CLASSPATH http_proxy
export EDITOR http_proxy
alias mysql='INPUTRC=~/.mysql_inputrc mysql'
alias i3-lock=i3lock
alias tnew='tmux new-session -As "`basename $PWD`"'

if [ -t 1 ]; then
    mesg n
    stty -ixon
    # stty stop undef 

    function aliasffmpegcut() {
        ffmpeg -ss $1 -i $3  -t $2 -acodec copy -vcodec copy -async 1 $4
    }
    alias ffmpegcut=aliasffmpegcut
    alias crepl='cabal repl --ghc-options="-ignore-dot-ghci -fdefer-type-errors"'

    keychain --nogui ~/.ssh/id_?sa
    source ~/.keychain/$HOSTNAME-sh
fi
