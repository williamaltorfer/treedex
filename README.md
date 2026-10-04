# 🌳 TreeDex

TreeDex is a little game for kids. You walk around your neighborhood, take a photo of a tree, and the app tells you what kind of tree it is. Once it knows, that tree gets "caught" and added to your collection — like a Pokédex, but for trees!

It's completely free to use, doesn't need an account, and doesn't collect or share any information. Everything your family catches stays only on your own phone.

**Try it here:** https://williamaltorfer.github.io/treedex/

## What it does

- 📸 **Catch trees.** Point your camera at a leaf, some bark, a seed, or a flower, and the app guesses what tree it's from.
- 📖 **Collect them.** Every tree you identify gets added to your TreeDex, organized by neighborhood (Maples, Mighty Oaks, Riverbank trees, and more).
- 🏅 **Earn badges and level up.** Catch enough trees and your kid "grows" from a Seed 🌰 all the way up to an Ancient Oak 🏞️, picking up badges along the way (like catching 3 different kinds of oak).
- 🌲 **Find a tree that's not on the list?** The app will still tell you what it is if it's confident, along with a real photo and some facts about it — it just won't count toward your collection, since the collection is a curated list of 28 Chicago-area trees.
- 🔊 **Read-aloud.** Every tree card has a button that reads the fun facts out loud, for kids who aren't reading yet.
- ❄️ **Works in winter too.** No leaves around? You can identify trees by their bark or seeds instead.
- 👨‍👩‍👧‍👦 **Multiple kids, one phone.** Each kid gets their own name/avatar, their own badges, and their own point total.

## How to install it on your phone

TreeDex isn't in the App Store — you add it straight from your web browser, and it'll work just like a normal app icon on your home screen.

**On an iPhone:**

1. Open **Safari** (it has to be Safari, not Chrome or another browser) and go to https://williamaltorfer.github.io/treedex/
2. Tap the **Share button** at the bottom of the screen (the square with an arrow pointing up ⬆️)
3. Scroll down and tap **"Add to Home Screen"**
4. Tap **"Add"** in the top corner

That's it! A TreeDex icon will appear on your home screen, and it'll open full-screen like any other app.

**On Android:** open the link in Chrome, tap the **⋮** menu in the top corner, and look for "Add to Home screen" or "Install app."

## A couple of things to know

- **You need an internet connection** to identify a tree (it asks a plant-identification service what it's looking at). If you're offline, your photo is saved and gets identified automatically the next time you're connected.
- **Everything stays on your phone.** There's no login, no account, and nothing is shared with us or anyone else. If you get a new phone or clear your browser data, your collection won't transfer unless you use the Export/Import backup option in Settings first.
- Every tree's description is checked against real sources (mainly the Morton Arboretum and Wikipedia), and we link to those sources so you can read more.

## For the curious (or other developers)

This app was built with React, TypeScript, and Vite, uses the free [Pl@ntNet](https://plantnet.org) API for plant identification, and is hosted for free on GitHub Pages. See `ARCHITECTURE.md` for the full design write-up and `CLAUDE.md` for the build history and project conventions.

```bash
npm install
npm run dev
```
