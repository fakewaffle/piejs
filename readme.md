## Pie.JS
Rapid development framework for node.js with inspiration from CakePHP. See the [Wiki](https://github.com/fakewaffle/piejs/wiki) for more information.

Prerequisites:
[node.js](https://github.com/joyent/node)

To try out:

    git clone git://github.com/fakewaffle/piejs.git
    cd piejs/
    node app.js

Open your browser:

    http://localhost:3000/posts/view/1

## Folder structure
* **app/** - All user code goes here.
    * **controllers/** - User controllers, such as posts_controller.js, tags_controller.js.
    * **models/** - User models such as posts.js, tags.js.
    * **public/** - Publicly accessible (stylesheets,javascripts, images).
    * **views/** - User views for each method in the user controllers.
* **pie/** - Users should not (or try not to) edit code here.
    * **libs/** - Code for Pie.
        * **controller/** - Pie Controller, user controllers 'inherit' from this.
        * **model/** - Pie Model, user models 'inherit' from this.
            * **datasources/** - Data sources for Pie Model. The only one included now is a test one being developed alongside Pie. See below for more information about stool. Pie is planning on supporting many data sources (such as MySQL, MongoDB, etc). Each data source should present the model and controller with the same basic CRUD methods and data structure.
    * **node_modules/** - node.js modules used for Pie.
* **stool/** - File based json store that is being developed alongside Pie. Used mainly for testing, but may be used for some of my own applications. Stores in folders based upon model name. The name of the file is the id (id.json).