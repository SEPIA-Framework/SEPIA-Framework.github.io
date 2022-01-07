#!/bin/sh
set -e
echo "Welcome to the SEPIA-Home updater."
echo ""
echo "This little script will help you update your SEPIA-Home server."
echo "In general it simply runs the included script (~/SEPIA/update-sepia.sh)"
echo "but it will update it beforehand to account for any changes."
echo ""
echo "Please place this script next to your SEPIA-Home folder (not inside!)."
echo "It will expect the default folder named 'SEPIA'."
echo ""
read -p "Press any key to continue (or CTRL+C to abort)."
echo ""
# Use master or dev?
BRANCH="master"
if [ -n "$1" ] && [ "$1" = "dev" ]; then
	BRANCH="dev"
fi
if [ -d "SEPIA" ]; then
	cd SEPIA
else
	echo "SEPIA folder not found! Please place this script next to the folder 'SEPIA' and run it from there."
	exit
fi
if [ -f "update-sepia.sh" ]; then
	echo "Removing old update script ..."
	rm update-sepia.sh
	echo "Downloading most recent version ..."
	wget "https://raw.githubusercontent.com/SEPIA-Framework/sepia-installation-and-setup/${BRANCH}/sepia-custom-bundle-folder/update-sepia.sh"
else
	echo "Old update script not found! Are you in the right 'SEPIA' folder?."
	echo "Abort."
	exit
fi
echo "Removing old backup script ..."
rm backup-sepia.sh
echo "Downloading most recent version ..."
wget "https://raw.githubusercontent.com/SEPIA-Framework/sepia-installation-and-setup/${BRANCH}/sepia-custom-bundle-folder/backup-sepia.sh"
echo "Starting update ..."
echo ""
bash update-sepia.sh
exit
