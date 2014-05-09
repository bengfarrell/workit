Work It
=======

So here's the deal, my wife is a freelancer and wanted a simple app to press a button and start tracking time. She plans to just copy over the hours into her
outgoing bills. There's probably software out there, but it's more complicated and pricey than she needs.

At the same time, I'm looking into [Atom Shell](https://github.com/atom/atom-shell) to see if I like it. Node-Webkit is pretty awesome, but I wanted to get
a lay of the land.

So, I perused the Atom-Shell docs and saw that they had:

- compiled releases for Mac, Windows, and Linux
- Node.js support with webkit on top, and a Javascript entry point
- a freakin GRUNT task for downloading their release
- a workflow that just involves copying over files to make stuff work

Pretty rad. I scaffolded out a web app with "yo angular". Then I replaced the "dist" folder with "default_app" as that seems to be the convention in their sample app.
I added in the grunt task to both the GruntFile.js and package.json. I'm not actually sure how to make this part of the workflow, because you download it once.
The atom-shell package ends up in your "binaries" folder. From there you can run the executable file and pass in the whole "default_app" folder as a parameter.
At that point, I figured, why not add a "grunt-shell" task to start the built app, right from the default grunt task.

When running it in this way, all console output goes right to my terminal like a normal Node.js app, which helped with some filepath trouble I was having.

Like I said, the app is pretty simple. You press a button to start a task, then press it again to end it. You can add a description to the task as well.
When done for the day, click export, and we it uses the Node.js fs import to write an HTML file with your tasks.

Not bad for a few hours. Way to go GitHub. If you find any flaws, it may because I'm on Windows and you're on Mac. Or because of my few glasses of wine tonight.