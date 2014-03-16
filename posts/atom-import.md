{{{
    "title"    : "My first Atom Package",
    "tags"     : ["atom", "plugin"],
    "category" : "Tech",
    "date"     : "2014-03-16",
    "dateText" : "16 Mar 2014"
}}}

[Atom](https://atom.io) - the latest editor in town is wonderful to work with.
The editor has a lot of exciting features like a Devtools console.
I wanted to add a new package to clone and open a git repo. This can be beneficial
if you are used to cloning lots of projects.

Please check out the package [here](https://atom.io/packages/import).

So, how to create an atom package? It's easy!

 - Install [Atom](https://atom.io).
    This also installs the Atom Package Manager(apm)
 - Do an `apm init --package <your_package_name>`
    This will generate an atom package skeleton
 - You will see the following files and folders created:
    - `keymaps/<project_name>.cson`
        This stores the keymap bindings for your package
    - `lib/<project_name>.coffee` & `lib/<project_name>-view.coffee`
        These two files are like the heart of your package.
    - `menus/<project_name>.cson`
        This describes the way your package appears in the menu.
    - `spec`
        The name says all. Keep you test cases here.
    - `stylesheets`
    - `package.json`, `readme.md`

Your package gets initialized from the `View.initalize` in `<project_name>-view.coffee`
The command to trigger this initalizing comes from the `command: <project_name>:toggle` option
provided in the menu mapping.
A simple package can be created with it. If you like to handle user inputs, `content` function
is one you should be aware of. Grep the [API](https://atom.io/docs/api/v0.73.0/api/).

To test the package, place it inside the `~/.atom/packages/`.
Make use of the Devtools inside atom to debug your package.

Add a helpful `readme` file and validate your `package.json`

Once you are done, proceed to publish the package using `apm publish minor`.
