# 🤖 Memebot: Discord Meme Management System

Memebot is a project that combines a **Discord Bot** and a **Web Frontend interface** to provide an efficient and customizable platform for community members to store, manage, and use their meme images.

## 🎯 Project Goals

* Provide an efficient Discord bot implemented in **Go** that can trigger meme output based on keywords.
* Build a **React + TypeScript** driven web interface to facilitate users in viewing, uploading, and managing memes and their custom aliases.
* Implement a **Many-to-Many** relationship model: one image can have multiple aliases, and one alias can also correspond to multiple images.

---

## 🏗️ System Architecture (Topology)

The project utilizes a microservice concept, dividing the functionality into three main components: the Discord Bot, the Web Backend (API), and the Web Frontend, all interacting with a shared Database/Storage.

<div style="text-align:center;">
    <img src="https://hackmd.io/_uploads/H1eUrs-f-l.png" width="70%"/>
</div>


---

## 🤖 Discord Bot Features

The bot is responsible for two main functions: image management and automated responses.

### 1. Image Trigger and Response

* **Trigger Mechanism:** The bot monitors chat messages. Once it detects that the message content contains any pre-defined **Alias**, it triggers a response.
* **Matching Algorithm:** For high-efficiency, real-time matching across a large set of aliases, we will use the **Aho-Corasick algorithm**.
* **Output Logic:** If the alias `<alias>` is matched, the bot will **randomly select** and send one image associated with that `<alias>` to the channel.

### 2. Discord Commands (Slash Commands)

| Command | Description |
| :--- | :--- |
| `/image upload` | Uploads an image. **Must include an image attachment** (JPG/PNG/GIF). The bot generates a unique **Image ID** (e.g., `670bc00e94fd77cf6852afc7`) and stores it. |
| `/image link alias: <alias> image: <image_ID>` | Adds or links an `<alias>` to the specified `<image_ID>`. |

---

## 🌐 Web Frontend Interface

The interface is built using **React + TypeScript** with **Tailwind CSS** to provide a user-friendly, visual management tool that is more convenient than using Discord commands alone.

### Page Layout and Functions

* **Navbar:** Displays the Bot's name on the left and contains **[Upload Image]** and **[Login]** buttons on the right.
* **Left Sidebar:** Serves as a **Table of Contents** for all **Aliases**. The last entry is for "**Images without aliases**".
* **Search Bar:** Located at the top of the right content area, featuring **real-time feedback** search functionality.
* **Content Area:** Displays image thumbnails grouped by their corresponding Alias.

### 1. 🔎 View and Management (Find)

* **Image Preview:** Clicking any image thumbnail will open a **floating window (Modal)**.
* **Image Information:** The modal will display the image, its uploader, upload time, and all associated Aliases.
* **Editing Features:** Users can edit Aliases or delete the image from this modal (login required).

### 2. ⬆️ Upload Image

Clicking the **[Upload Image]** button opens a modal for submission: