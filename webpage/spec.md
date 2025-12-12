# Webpage for Memebot


## Update the filtering policy of the search bar

The current filtering policy is:
```ts
// Filter aliases based on search
const filteredAliases = searchQuery
? allAliases.filter(alias =>
    alias.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
: allAliases;
```

Please update the policy from "filter by substring" to "filter by subarray".

Suppose "cd" is the current search query, the following examples are matched results:
- "abcde" (matched)
- "cwwwwd" (not a match originally)

The following examples are not matched:
- "adce" (not a match originally)
- "dwwwwc" (not a match originally)

The implementation logic may should be O(sum of length of all aliases + length of search query) and should break the loop of checking a single alias as soon as that alias is marked as "matched".

<!-- The current implementation could be slightly improved by:
1. Not using toLowerCase() for text and query initially
2. Instead, scan the text and query character by character, and break the loop as soon as the queryIndex equals lowerQuery.length
 -->




## Don't redirect 401 to home page

Modify the login mechanism such that:
- When invalid token is provided upon entering the webpage by web browser, show a popup message "login error" and do not redirect to home page (even not load elements of the webpage).
- Do not use alert() to show "login error", instead, use a React component to show "login error".



## Modify the uploadmodal's and imagemodal's alias adding/removing mechanism

Modify the uploadmodal's and imagemodal's alias adding/removing mechanism to the following:
[  (press Enter or click ADD to add alias)      ] [ADD]

After typing alias and click ADD
[  test_alias                           ] [REMOVE]
[  (press Enter or click ADD to add alias)      ] [ADD]

The [ADD] and [REMOVE] are buttons, and should both have the same width.  Also, the protection mechanism (zero alias = not allow to save modifications / upload images) should be retained.




## Modify the webpage

Modify the webpage: We don't want one page shows only an alias.
We want a paging feature on aliases, so that each page shows a fixed number of aliases and their corresponding images (the fixed number can be stored in a variable in api.ts).  And the "next page" and "previous page" buttons should be located at both the top (below search bar) and the bottom of the page.
The sidebar is also modified to show the current page number, the aliases on the current page, and the total number of pages.






## Initial Setup

This webpage is used to manage the images and aliases used by our Discord memebot.

Relationship between images and aliases: many to many.



### Layout

React + TypeScript (with Tailwind CSS)

The webpage layout is roughly as follows:
```
Memebot                              [Upload-Image] [Login]
-----------------------------------------------------------
alias_01      |     ( Search Bar                          )
alias_02      |
alias_03      |     Alias: alias_01
alias_04      |     [ Img Box1 ] [ Img Box2 ] [ Img Box3 ] 
alias_05      |     
alias_06      |     Alias: alias_02
alias_07      |     [ Img Box1 ] [ Img Box2 ]
alias_08      |     
alias_09      |     Alias: alias_03
alias_10      |     [ Img Box1 ] [ Img Box2 ] [ Img Box3 ]
alias_11      |     [ Img Box4 ]
Img w/o alias |
```

The top is the Navbar:
- The left side of the Navbar shows our project name.
- The right side of the Navbar contains function buttons, currently only Upload Image and Login.


#### Find

Find (Viewing and Searching)
- The left sidebar serves as a table of content for all aliases, similar to the navigation feature in HackMD or mdBook.
    - The last entry is "Images without aliases" (Img w/o alias).
- The search bar is located directly below the Navbar.
    - The search bar provides instant feedback; the system automatically lists matching aliases and corresponding images without the user needing to press enter.
- The content below the search bar displays images grouped by their respective alias.
    - Clicking an image brings up a floating window (modal) showing the image and related information (including who uploaded the image, when the image was uploaded, and what aliases it has).  Within this modal, the user can edit aliases and delete the image.
    ```
    ======================================
    | |--------------------------------| |
    | |                                | |
    | |                                | |
    | |        Show Image Here         | |
    | |                                | |
    | |                                | |
    | |--------------------------------| |
    |                                    |
    | Uploaded Time: 2023-10-20.12:00    |
    | Uploaded By: konchin.shih          |
    |                                    |
    | Aliases of this image:             |
    | [-] [ alias_01                   ] |
    | [-] [ alias_02                   ] |
    | [+] [ (Add a new alias)          ] |
    |                                    |
    |                             <Save> |
    ======================================
    ```



#### Upload Image

When the user clicks this button, a floating window (modal) appears:

```
======================================
| |--------------------------------| |
| |                                | |
| |                                | |
| |      Drag your image here      | |
| |                                | |
| |                                | |
| |--------------------------------| |
|                                    |
| Aliases of this image:             |
| [-] [ alias_01                   ] |
| [-] [ alias_02                   ] |
| [+] [ (Add a new alias)          ] |
|                                    |
|                           <Upload> |
======================================
```

#### Login (Authentication)

Authentication is used to verify the current Discord user operating the frontend. Users who are not logged in can only perform viewing-related operations; they cannot edit, upload, or delete.



