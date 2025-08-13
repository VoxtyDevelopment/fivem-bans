
# External Security Bot to FiveM Ban 

This script works side by side with the Vox Development external security bot to sync your banned members from the external security bot database and ban them from the FiveM server.

## Requirements for installation;
- MySQL
- External Security Bot (Optional if you want to make your own integration)

## Installation is as follows;
- Go to [releases](https://github.com/voxtydevelopment/fivem-bans/releases/tag/release) and download the fivem-bans.zip
- Extract the zip files into your FiveM resources directory
- Extract either the contents of `vox.cfg` into your `server.cfg` file or add `exec vox.cfg` to your `server.cfg` file
- Add `ensure fivem-bans` to your `server.cfg` file

## To work with the source code
- Clone or Download the repository:
  ```
  git clone https://github.com/VoxtyDevelopment/fivem-bans.git
  cd fivem-bans
  ```
- Open the code in a code editor of your choice
- After editing run `npm run build` in your console

## Developers
- [@voxty](https://github.com/voxty)