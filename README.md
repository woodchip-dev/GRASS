# GRASS
## Glorious Root Allocation Synergetic System
Created this for CS601. You can read about the assignment premise in `Root_Vegetable_Distribution_Two_Glorious_Page.pdf`.

## Things Used For This Project
For the front-end, [Foundation by Zurb](https://foundation.zurb.com/) and the free version of [Font Awesome](https://fontawesome.com/) are used (the latest versions of both can simply be downloaded from their websites).

The back-end things installable with pip are listed in `requirements.txt` (may not be complete) and are as follows:
```Flask==0.12.2
flask-sockets
gunicorn==19.4.5
PyMongo>=3.6.1
```
In order to make updates in real-time between the main and admin pages, [flask-sockets](https://github.com/heroku-python/flask-sockets) is used and is the reason `gunicorn` is a requirement.
Python2 is used, but Python3 should be just fine.
MongoDB version 3.6 is used, but a later version should be just fine as well, you just can't use an earlier version because `change stream` was introduced in 3.6 and is necessary to detect database changes. You also must make your database into a `replica set` (unless you're using multiple databases or want to store subsets of data in different databases, in which case a `sharded cluster` is an additional option), because `change stream` won't report when a change has been made to a `collection` otherwise.
