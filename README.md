# node-multitool

A command line multi-tool for developers

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) installed.

```sh
npm install -g node-multitool
mtool --help
```

Now you can run node-multitool commands. Seek help via command line or view the commands below

## Commands

```sh
mtool --help  # shows general commands
mtool --help <command>  # shows help for a specific command

# bcrypt
mtool bcrypt salt  # generates a random salt
mtool bcrypt salt [rounds]  # generates a random salt specifying the optional number of rounds to process the data 
```