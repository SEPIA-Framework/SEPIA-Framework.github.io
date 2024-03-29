#!/bin/bash
set -e
clear
echo "Welcome to the SEPIA Framework Client Installer :-)"
echo ""
echo "This script will download the SEPIA Client installation files for Raspberry Pi OS"
echo "to this folder: '~/install'"
echo ""
echo "NOTE: It is intended to be used with a fresh and clean Raspberry Pi OS Lite but if"
echo "you're feeling adventurous you can try it with other (Debian based) Linux versions as well ;-)."
echo ""
echo "More info: https://github.com/SEPIA-Framework/sepia-installation-and-setup/"
echo ""
read -p "Press any key to continue (or CTRL+C to abort)."
echo ""
if ! [ -x "$(command -v unzip)" ]; then
	if [ -x "$(command -v apt)" ]; then
		echo "Installing required packages: unzip"
		sudo apt update
		sudo apt install -y unzip
	else
		echo "Package 'unzip' is required. Please install and try again."
		exit 1
	fi
fi
# Use master or dev?
BRANCH="master"
PACKAGE="sepia_client_raspberrypi_os.zip"
if [ -n "$1" ] && [ "$1" = "dev" ]; then
	BRANCH="dev"
fi
echo "Creating folder '~/install' ..."
mkdir -p ~/install && cd ~/install
echo "Downloading installation package from branch: $BRANCH ..."
wget -O "$PACKAGE" "https://github.com/SEPIA-Framework/sepia-installation-and-setup/raw/$BRANCH/sepia-client-installation/$PACKAGE"
echo "Unzipping package ..."
unzip "$PACKAGE"
echo "Done."
echo ""
echo "Please continue with:"
if [ "$BRANCH" = "dev" ]; then
	echo "cd ~/install && bash menu.sh dev"
else
	echo "cd ~/install && bash menu.sh"
fi
