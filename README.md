# Trickster static web server

![screenshot of sample website that says: "welcome to my trickster web server, where the html stays the same, but nothing else does"](https://cdn.glitch.global/86e4d4a9-57b9-46ac-8449-27765a6230ef/preview.png?v=1711304725822)

This is a remixable Glitch project with a static web server that won't give you want you ask for. Use it to build surprising, playful, unstable, and ...maybe even unusable, websites.

A static web server is (traditionally) responsible for responding with whatever file is being requested. So when you click on a link `<a href="pages/about-me.html">Read more about me</a>`, a static web server will check to see if it has a file `about-me.html` in the `/pages` directory and then send that file if it has it. 

The trickster web server will respond with random file of the same type requested. So when you link to `/pages/about-me.html`, the trickster server will send you back _another_ HTML page, but without telling you any different. It supports serving randomly files from the `public` directory and from any assets uploaded to Glitch in this project.

## How to use
You can build websites like you'd normally do! With a few notes:
* Link to any assets hosted on the Glitch CDN (usually referenced with custom `https://cdn.glitch.com/` links) by pretending they're in a folder called `assets` and using the filename, like `<img src="/assets/my-picture.jpg" />`
* Link to files in the `public` directory as you normally would, like `<a href="public/pages/about-me.html">Read more about me</a>`
* If you have files they you'd like served without any tricks, add the filename to the list of exceptions in `server.js` on line 13

Note: if you're using CSS stylesheets and JavaScript files linked with an HTML page, they'll be replaced randomly, too! If you want those styles or scripts to be stable, you can either add their content inline to the HTML page (within `<style>` or `<script>` tags respectively) instead of linking them, or you can add them to the list of file exceptions in `server.js`. 

This project comes with a few files and assets to show how the basic functionality works. When you remix, feel free to delete them and start from scratch.

## What's in this project?

← `README.md`: That’s this file, where you can tell people what your cool website does and how you built it.

← `server.js`: The trickster server script for your new site. You shouldn't need to edit this file unless you want to change how it behaves or add exceptions to the tricks it'll play.

← `public`: This folder holds any files that you want to be available from your site.

## Contributing
If you find a bug or want to suggest an improvement to this project, head over to [Github](https://github.com/lizzthabet/trickster-server). I'll do my best to respond to issues and PRs. :)