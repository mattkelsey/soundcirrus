# SoundCirrus
SoundCirrus is a command-line utility written in NodeJS that allows the user to access media on SoundCloud.

## The Why
SoundCloud is fantastic. I listen to all of my music on SoundCloud, but the web interface is heavy. If you're a programmer like me, chances are you listen to music while programming and having a web browser open just for music seems a little impractical. It bogs down workflows. In an interface surrounded by terminals I couldn't help but think: _Wouldn't it be great if I could just play my playlist through the command line_. That's SoundCirrus.

## SoundCirrus? Do you mean SoundCloud?
No I don't. A cirrus is the start of an atmospheric cloud body. It's those whispy clouds that you can barely see, so far above other clouds it seems as if they could be in space. Now picture you're standard puffy white cloud; a cumulus. While it's nicer to look at than a cirrus, it's heavy and slow moving as a result of its excess water vapor. Like SoundCloud this cumulus is beautiful and nice to look at, but if you need something light and don't care about aesthetics you'd choose Cirrus.

Am I way to into this analogy? Absolutely.

## Installation

SoundCirrus is still in development. Like pre-beta... Alpha. Installation and setup may take a little experience with [npm](https://npmjs.com) if something goes wrong. But if all goes to plan, it should be quick.

 1. Clone this repo (`git clone https://github.com/mattkelsey/soundcirrus.git`).
 2. Install dependencies (`npm install`).
 3. Jam out.

## Usage

Feature requests are super welcome! I have no idea how other people will want to use this (if at all). Open an issue or ask me directly!

You can run SoundCirrus using `node`. Use an up-to-date version of `node` for best results (obviously).

`node cirrus.js`

With no arguments specified SoundCirrus will take the default action: begin playing an arbitrary playlist... Not very useful.

SoundCirrus can take the following arguments:
 - `-P <id>`: begins playing playlist with specified ID
 - `-p <name>`: begins playing playlist by name specified in configuration file (see Configuration)
 - `-r`: plays playlist in revere
 - `-d`: saves downloaded mp3 files so they can be accessed later through other media players
 - `-D`: same as above but doesn't play songs once they are downloaded... just downloads songs without playing

## Configuration

The default configuration file is in the root of the repository and is entitled `config.json`. Open it in your prefered text editor.

The config uses standard JSON syntax. You can use it to essentially bookmark playlists. For instance with the default configuration I could use `node cirrus.js -p songs` as apposed to `node cirrus.js -P 24967373`... Much more convinient.

An example of using the config:

I have a playlist on SoundCloud with id of `1234`. I want to bookmark it with the name _myk3wlplaylist_. I would add a key in `playlists` like so.

```js
{
    "playlists": {
        "songs": "24967373",
        "test": "208618843",
        "hw": "90090128",
        "myk3wlplaylist": "1234"
    }
}

```

Again SoundCirrus is in an early stage in development so error handling is at a minimum. I would recommend running your config through a JSON validator if you are not already familiar with the syntax.

## Finding IDs
The term "id" is thrown around a lot... For those familiar with SoundCloud already this probably makes sense. For those not, here is a quick primer.

All of SoundCloud's assets have unique identifiers; IDs. Users have them as well as individual tracks and playlists. Right now Cirrus only supports playlists. To find the ID of a playlist open the "Share" dialog in the SoundCloud web interface of the playlist.

Move over to the "Embed" tab and copy the code snippet. I recommend pasting into a search bar or text editor because the code snippet in the share panel on SoundCloud doesn't allow selection of a small portion of the text, only the whole thing.

In the code snippet find `api.soundcloud.com/playlists/`. The number following this is the ID of the playlist.

## Contributing
I can't imagine anyone wanting to contribute right now but I will merge pull requests if you do! Just give a quick description of the change.
