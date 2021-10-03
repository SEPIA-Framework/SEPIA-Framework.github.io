#!/bin/bash
set -e
clear
echo "Welcome to the SEPIA Framework Client Installer :-)"
echo ""
echo "This script will download the SEPIA Client installation files for Raspberry Pi OS"
echo "to this folder: '~/install'"
echo ""
echo "NOTE: It is inteded to be used with a fresh and clean Raspberry Pi OS Lite but"
echo "if you're feeling adventurous you can try it with other Linux versions as well ;-)."
echo ""
echo "More info: https://github.com/SEPIA-Framework/sepia-installation-and-setup/"
echo ""
read -p "Press any key to continue (or CTRL+C to abort)."
echo ""
# Use master or dev?
BRANCH="master"
if [ -n "$1" ] && [ "$1" = "dev" ]; then
	BRANCH="dev"
fi
echo "Creating folder '~/install' ..."
mkdir -p ~/install && cd ~/install
echo "Downloading installation package from branch: $BRANCH ..."
wget -O "sepia_client_rpi_raspbian_buster.zip" "https://github.com/SEPIA-Framework/sepia-installation-and-setup/raw/$BRANCH/sepia-client-installation/sepia_client_rpi_raspbian_buster.zip"
echo "Unzipping package ..."
unzip sepia_client_rpi_raspbian_buster.zip
echo "Done."
echo ""
echo "Please continue with:"
if [ "$BRANCH" = "dev" ]; then
	echo "cd ~/install && bash menu.sh dev"
else
	echo "cd ~/install && bash menu.sh"
fi
