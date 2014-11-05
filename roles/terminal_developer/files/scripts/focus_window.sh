#!/bin/sh

# Finds and focuses a window which matches the name specified and also outputs
# the name of the previously focused window

OLD_WINDOW=`xdotool getwindowfocus | head -1`
WIDS=`xdotool search --name "$1"`
WID=bob
for W in $WIDS
do
	WID=$W
done
xdotool windowactivate $WID
