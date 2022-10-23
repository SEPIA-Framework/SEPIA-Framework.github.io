#!/bin/sh
set -e
get_latest_release() {
	curl --silent "https://api.github.com/repos/$1/releases/latest" | # Get latest release from GitHub api
		grep '"tag_name":' |                                          # Get tag line
		sed -E 's/.*"([^"]+)".*/\1/'                                  # Pluck JSON value
}
echo "Welcome! Checking version number of latest SEPIA release, just a second ..."
SEPIA_VERSION=$(get_latest_release "SEPIA-Framework/sepia-installation-and-setup")
echo "Latest SEPIA-Home version is: $SEPIA_VERSION"
echo ""
echo "Welcome to the SEPIA-Framework!"
echo ""
echo "This little script will help you to setup your environment and download SEPIA-Home (the server stack of SEPIA)."
echo "If you are using a fresh Raspberry Pi OS installation please follow steps 1 to 4 and make sure they complete successfully."
echo "If you know what you are doing feel free to skip some steps as needed ;-)"
echo "More help can be found here: https://github.com/SEPIA-Framework/sepia-docs/wiki"
echo ""
echo "Tested on: Raspberry Pi OS 'bullseye' 32/64bit (2021-12-31)"
while true; do
	echo ""
	echo "Please choose next step:"
	echo "1: Install Java OpenJDK 11 globally (alternative: download SEPIA-Home first and use local Java installation)"
	echo "2: Update server-clock for precise timers and events (enable NTP)"
	echo "3: Download SEPIA-Home bundle version: $SEPIA_VERSION"
	echo "4: Extract SEPIA-Home to '~/SEPIA' and install some recommended (Debian) packages"
	echo "5: Optional: Install NGINX reverse-proxy"
	echo "6: Start setup (~/SEPIA/setup.sh)"
	echo ""
	read -p "Enter a number plz (0 to exit): " option
	echo ""
	if [ $option = "0" ]
	then
		break
	elif [ $option = "1" ]
	then
		# INSTALL JAVA OPENJDK 11
		sudo apt update
		sudo apt-get install -y openjdk-11-jdk-headless ca-certificates-java
		echo "------------------------"
		echo "DONE."
		java -version
		echo "------------------------"
	
	elif [ $option = "2" ] 
	then
		# UPDATE TIME SYNC
		echo "Using 'timedatectl' to sync time ..."
		sudo timedatectl set-ntp true
		echo "------------------------"
		echo "DONE."
		echo "------------------------"

	elif [ $option = "3" ] 
	then
		# DOWNLOAD SEPIA Custom-Bundle
		mkdir -p ~/SEPIA/tmp
		cd ~/SEPIA/tmp
		wget "https://github.com/SEPIA-Framework/sepia-installation-and-setup/releases/latest/download/SEPIA-Home.zip"
		echo "------------------------"
		echo "DONE."
		echo "------------------------"

	elif [ $option = "4" ] 
	then
		# INSTALL zip, unzip, curl, procps, etc.
		if [ -x "$(command -v apt)" ]; then
			echo "Checking packages: zip unzip curl git procps ca-certificates"
			sudo apt update
			sudo apt-get install -y zip unzip curl git procps ca-certificates
		else
			echo "Recommended packages: zip unzip curl git procps ca-certificates"
		fi
		
		# EXTRACT SEPIA-Home bundle
		cd ~/SEPIA/tmp
		unzip SEPIA-Home.zip -d ~/SEPIA
		
		# SET SCRIPT ACCESS AND DONE
		
		#set scripts access
		cd ~/SEPIA
		find . -name "*.sh" -exec chmod +x {} \;
		chmod +x elasticsearch/bin/elasticsearch
		
		#done
		echo ""
		echo "------------------------"
		echo "DONE :-) If you saw no errors you can exit now and continue with 'cd ~/SEPIA' and 'bash setup.sh'".
		echo "------------------------"

	elif [ $option = "5" ] 
	then
		# INSTALL NGINX
		echo 'Installing nginx reverse-proxy ...'
		sudo apt-get install software-properties-common libssl-dev
		sudo apt-get install nginx
		echo "------------------------"
		echo "DONE. To create a SEPIA Nginx config and set up SSL run 'bash setup-nginx.sh' inside your SEPIA-Home folder"
		echo "------------------------"

	elif [ $option = "6" ] 
	then
		# SEPIA SETUP
		clear
		echo 'Starting SEPIA setup ...'
		cd ~/SEPIA
		bash setup.sh
		exit

	else
		echo "------------------------"
		echo "Not an option, please try again."
		echo "------------------------"
	fi
done
