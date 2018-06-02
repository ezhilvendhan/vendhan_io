{{{
    "id"       : "20140316im",
    "title"    : "Import - My first Atom Package / Plugin",
    "tags"     : ["atom", "plugin"],
    "category" : "Tech",
    "date"     : "2014-03-16",
    "dateText" : "16 Mar 2014"
}}}

I wanted to create a new Atom package/plugin that can git clone and open a git repo. This makes easier and simpler
to import a project straight from github and open it in Atom.

With this package, to import a git repo, you just need to hit `ctrl + shift + i` and enter the `git`
url Eg: `https://github.com/ezhilvendhan/import`. Bingo! Your project will be imported to Atom.

If your project Eg: `my_project` exists already in your Atom project home, you can open
it too by just providing `my_project` or the folder name

Not sure where your project home is? Check out @ `Atom > Preferences > Settings > Core Settings > Project Home`

Please check out the package [here](https://atom.io/packages/import).

You can create a simple atom package by:

 - Installing [Atom](https://atom.io).
    This also installs the Atom Package Manager (apm)
 - Do an `apm init --package <your_package_name>`
    This will generate an atom package skeleton.
 - You will see the following files and folders created:
    - `keymaps/<project_name>.cson`
        This stores the keymap bindings for your package
    - `lib/<project_name>.coffee` & `lib/<project_name>-view.coffee`
        These two files are like the heart of your package.
    - `menus/<project_name>.cson`
        This describes the way your package appears in the menu.
    - `spec`
        The name says all. Keep your test cases here.
    - `stylesheets`
    - `package.json`, `readme.md`

Your package gets initialized from the `View.initalize` in `<project_name>-view.coffee`
The command to init comes from `command: <project_name>:toggle` option
provided in the menu mapping.
A simple package can be created with it. If you like to handle user inputs, `content` function
is the one you should be aware of. Grep the [API](https://atom.io/docs/api/v0.73.0/api/) for more.

To test the package, place it inside the `~/.atom/packages/`.
Make use of the Devtools inside Atom to debug your package.

Add a helpful `readme` file and validate your `package.json`

Once you are done, proceed to publish the package using `apm publish minor`.
