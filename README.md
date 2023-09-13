# Overview 
The SRT API is an Express.js Node application that provides a RESTful API for the SRT client. The SRT client and API together deliver the web portal called the [Solicitation Review Tool](https://srt.app.cloud.gov/auth) for viewing Section 508 compliance predictions for solicitations submitted from agencies around the federal government while also allowing its users to provide feedback to SRT. 

The SRT API runs in a Docker container and accesses solicitations data that is scraped daily from SAM.GOV and stored in a Postgres database housed on cloud.gov. To facilitate development, testing and deployment of this application, this API runs in 3 different instances on cloud.gov - production, staging and development. 

A developer on this project will work in a command line environment in any one of several operating systems and use an IDE such as Visual Studio Code. A brief setup guide is outlined below. A developer will also need account access to various environments in order to work on this project: Cloud.gov, SAM.gov, etc. See details below. 

Node Package Manager (npm) and yarn are used to install and update Node modules for this project and the security of each of these Node modules is maintained through SNYK. 
# Developer Requirements 
## Software Components and Tools 
The following is a summary of the software and tools that are needed for development of this project: 
* Operating system - Linux, Ubuntu, Mac OS, Windows 
* IDE - Visual Studio Code, etc. 
* Docker 
* PostGres 
* SNYK 
* GitHub 
* Node 
## Systems Access 
Access to the following platforms will also be required for development: 
* Cloud.gov 
* SAM.gov 
* MAX.gov 
* Docker.com and hub.docker.com 
* SNYK.io
* GitHub - GSA team 
## Environment Variables 
There are a few environment variables that control the configuration or set security sensitive keys. On cloud.gov any variables you would like to configure manually can be changed using the cloud.gov control panel or CLI.
* **NODE_ENV** - This should be set based on the environment. It is used to switch between the available environments. Examples include production, cloudstage, clouddev, circle, development.
The definitive list can be found by reading config.js.
* **VCAP_SERVICES** - cloud.gov will automatically set this environment variable. It contains connection information for the specific postgres database for that environment - and also any other cloud.gov services or connections that may be configured in the future. 
# Setup and Deployment  
## Getting Started
* To get started with SRT-API, go to [GSA/srt-api](https://github.com/GSA/srt-api) to copy the URL for cloning the project. 
* Open Terminal or use Visual Studio Code and open a terminal window. 
* Navigate to the desired folder and clone the project. 
## Installation 
* Navigate to the bin folder that was created through the clone. 
* Type `./dev_setup.sh` to begin installation. 
* Note - If this script fails during execution, please refer to the manual setup guide for installing the necessary tools and packages here: [srt-api - documentation](https://github.com/GSA/srt-api/tree/main/documentation).  
* This script will install and set up much of what you need for this project: 
    * Node Package Manager (npm) 
    * Postgres 
    * Node Version Manager (nvm) 
    * SNYK - log into SNYK using your GitHub account when prompted by the script 
* This script will also create the needed local Postgres database with all of the tables required by this project, if they do not already exist. 
* It will also install Node Version 16, which is the requirement for this project. 
* This script will then install and update all of the required Node modules. 
## Running and Configuration  
The `npm run start` command will start the server. Database configuration options are read from server/dbConfig/dbConfig.js and general configuration from server/config/config.js file. dbConfig.json holds the configuration for every environment the app my be run in and the specific configuration for this run is chosen based on the NODE_ENV environment variable.

Database connection information is stored in the dbConfig.js file but will be overridden by any settings in the VCAP_SERVICES environment variable. This feature allows cloud.gov to inject the proper database connection information upon startup.
## Deployment 
[Need text that describes the current deployment process here]
# More Info  
For more detailed information, please refer to the documentation here: [Documentation](https://github.com/GSA/srt-api/tree/main/documentation) 
