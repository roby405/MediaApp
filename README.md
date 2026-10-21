# MediaApp - A WIP app to provide a way to store most types of files, in an easy-to-view library, with a planned option to share files P2P through WebRTC messages.

This app was created with the purpose of having a clean architecture even at a professional level, and to have every version of the app use as many common parts as possible, so the business logic is not reliant on the platform of the app.

The app is built using React + Vite for the Web build, ReactNative for the Android build, and React+Tauri for the desktop build, and it is for now client-side only, with a plan to establish a server for WebRTC signaling once I get to the P2P features.

## Features
- Ability to import files and then access them later, with persistent storage.
- Support to play various audio, video, image formats, PDF files, and a custom-built EPUB and CBZ player.
- Media Streaming so you dont have to fill your entire RAM just by loading a single large file.
- Custom built library, with search and filter options, with extracted previews of every media File at the time of importing, so you can scroll through the library and not rely on just the file names.
- Easily rename or delete files through a button that summons a modal near your media file.
- Every file format has a custom Media Player:
* Audio and video files have a floating extendable player, with options to favourite media, media playback options, and auto detection of music metadata, so you can easily find songs in your library by their covers.
* Image files have a custom player that tries to recreate how a phone's gallery works and looks, from the animations, to pinching gestures.
* EPUB, CBZ, and PDF players are still rather barebones, but they work, and you can view every part of their contents with no issues.

## Architecture
- Built heavily with Zustand stores, in order to not have to use so much of the React built-in hooks. Every part of the app subscribes to just a few elements, and it mostly removes the need for prop drilling, although I still use it at some point.
- Every part of the app is built on a different store, and stores are generally used inside every platform of the app, as basically a namespace, without having to change something from within the stores itself, as such creating a platform-agnostic solution. For that, I had to create generic type structures and classes, which offer functions only for the business logic part of the application, that are then built upon by each platform with their platform-specific code. As such, I don't ever have to do platform checks within the shared part of the app.
- Employed the use of a lot of design patterns where they were fit for the job, such as strategy, and reverse-injecting dependencies (I think that's what it was called).
- Everything is strongly typed, with a lot of custom types, I also used a lot of type unions to generalize Media and its many parts.
- ...and a lot of other things that I can't remember, as this is written quite a while after my last commit

### Note: The app for the web version might currently not be working, as I have done a lot of architecture changes once I started with the mobile port. If you want to test the web version, please search through the commits to a point where I had not yet created the mobile port. Also, the app was created with no AI usage except like 3 or 4 files out of over a hundrede where I mention directly on top that I used it (mostly in Framer Motion related files)
