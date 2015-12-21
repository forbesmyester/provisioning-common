# ~/.bashrc: executed by bash(1) for non-login shells.
# see /usr/share/doc/bash/examples/startup-files (in the package bash-doc)
# for examples

# If running interactively, then:
if [ "$PS1" ]; then

	# don't put duplicate lines in the history. See bash(1) for more options
	# export HISTCONTROL=ignoredups

	# check the window size after each command and, if necessary,
	# update the values of LINES and COLUMNS.
	#shopt -s checkwinsize

	# enable color support of ls and also add handy aliases
	if [ "$TERM" != "dumb" ]; then
		eval `dircolors -b`
		alias ls='ls --color=auto'
		alias dir='ls --color=auto --format=vertical'
		alias vdir='ls --color=auto --format=long'
		alias wget='wget --user-agent="Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.7) Gecko/20040811 Firefox/0.9.3"'
	fi

	# set a fancy prompt
	PS1='\n\[\033[32m\]\u@\h\[\033[0m\]:\[\033[36m\]\w $ \[\033[39m\]'

	# If this is an xterm set the title to user@host:dir
	case $TERM in
	xterm*)
		PROMPT_COMMAND='echo -ne "\033]0;${USER}@${HOSTNAME}: ${PWD}\007"'
		;;
	*)
		;;
	esac

	# enable programmable completion features (you don't need to enable
	# this, if it's already enabled in /etc/bash.bashrc).
	#if [ -f /etc/bash_completion ]; then
	#	. /etc/bash_completion
	#fi

fi

LS_OPTIONS='--color=auto'
EDITOR=vim
LANG=en_GB.UTF8
LC_ALL=en_GB.UTF8
LC_CTYPE=en_GB.UTF8
SHELL=/bin/bash
export FZF_DEFAULT_COMMAND='ag -l -g ""'

source ~/.nvm/nvm.sh
PATH=~/.x_scripts:~/.scripts:~/.bin:~/.vendor/bin:~/.cabal/bin:node_modules/.bin:~/.linuxbrew/bin:${PATH}

export NODE_ENV=development
[ -f ~/.fzf.bash ] && source ~/.fzf.bash
