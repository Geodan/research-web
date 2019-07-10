# research-web
Home page for website https://research.geodan.nl, based on [LitElement](https://github.com/Polymer/lit-element)

## usage

### pre-requisites
* git
* npm
* polymer-cli (npm install -g polymer-cli)

### install
    git clone url_of_this_repository research-web
    cd research-web
    npm install

### preview
    polymer serve
Point you browser to the url displayed by polymer (usually http://localhost:8081)

### modify demo's
Demo's are defined in file ``config/config.json``. This json contains an array of demo definitions. Instead of removing a demo, you can set/add property ``"disabled": true``.   
Every new demo requires:
* ``"url":`` URL to the actual demo
* ``"thumbnail":`` Thumbnail image, 200px wide, about 150px high (store in directory ``thumbnails/``)
* ``"title":`` Title
* ``"description":`` Description
* ``"tags":`` optional array of tags / keywords
* ``"date":`` (month + year of publication)

### build
The build step is not necessary for updating the list of demos. To update the demo's, you can copy the updated ``config/config.json`` file and the updated ``thumbnails/`` to the webserver and reload the website into the browser.

If you changed the code or the look and feel of the website, a new build is required:

    polymer build
    cd build/es5-bundled

directory ``build/es5-bundled`` now contains the updated website (including newest ``config/config.json`` and ``thumbnails/``). If you use ``scp``, you can deploy the new website to the production environment:

    scp -r * user@production-host:/path/to/website/rootdir/

Or use another method of deploying the website to production.