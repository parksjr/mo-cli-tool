# mo-cli-tool

A developer's tool for command line (called mo). 

## A brief history of mo

It's called mo mainly because it's simple to type. It started out as mtool, which was short for multi-tool, which is essentially what I want to use this cli for. All purpose command line stuff that I normally do in my normal development cycle. I do windows dev so most of the scripts i initiated with are some windows only commands. But this tool can easily be universal.

## Install globally

Make sure you have [Node.js](http://nodejs.org/) installed.

```sh
npm install -g parksjr/mo-cli-tool
```

Optionally, you can fork and clone this repository and install it globally with the following commands

```sh
git clone git@github.com:parksjr/mo-cli-tool.git
cd mo-cli-tool
npm install && npm link
```

Now you can run mo commands. Seek help via command line.

## Commands

```sh
mo -h  # shows general commands
mo <command> -h   # shows help for a specific command
```

## Contributing
It's really easy to contribute to this project. If you want to add a new feature, just create a new file called [script-name]-tool.js in the scripts directory. View the .sample file for a very basic guideline, and the other script tools that already exist in that directory. Send a PR if you want to add a feature or fix a current one.