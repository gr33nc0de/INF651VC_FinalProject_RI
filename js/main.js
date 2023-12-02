//1 
//Receives 3 parameters to create HTML element, className optional
//Returns created element
function createElemWithText(elementType, textContent, className) 
{
    //HTML element string name to be created (h1, p, button, etc), default value p
    const element = document.createElement(elementType || 'p');
    element.textContent = textContent || '';

    if (className) 
    {
        element.className = className;
    }

    return element;
}

//2
//Receive data from users to generate array of options for the dropdown
function createSelectOptions(usersData) 
{
    if (!usersData) return undefined;

    // Array to store the created option elements
    const optionsArray = [];

    // Loop through users data
    usersData.forEach((user) => {
        // option element for each user
        const optionElement = document.createElement("option");

        optionElement.value = user.id;

        optionElement.textContent = user.name;

        optionsArray.push(optionElement);
    });

    return optionsArray;
}

//3 show/hide comments
function toggleCommentSection(postId) 
{
    // Check if postId parameter is not provided
    if (!postId) return undefined;

    // Select element with data-post-id attribute = to postId
    const sectionElement = document.querySelector(`section[data-post-id="${postId}"]`);

    // Check if section element exists
    if (sectionElement) 
    {
        sectionElement.classList.toggle('hide');
    } else {
        return null; //if it doesn't exist, null
    }

    return sectionElement;
}


//4 button for show/hide
function toggleCommentButton(postId) 
{
    if (!postId) return undefined;

    // Select button w/data-post-id attribute = postId
    const buttonElement = document.querySelector(`button[data-post-id="${postId}"]`);

    if (buttonElement) 
    {
        // 'Hide Comments' if buttonElement.textContent === 'Show Comments' is true; otherwise, 'Show Comments'
        buttonElement.textContent = buttonElement.textContent === 'Show Comments' ? 'Hide Comments' : 'Show Comments';
    }

    return buttonElement;
}

//5 clearing all entries on current page 
function deleteChildElements(parentElement) 
{
    // Check if parentElement is not provided or is not an HTML element
    if (!parentElement || !(parentElement instanceof HTMLElement)) return undefined;

    let child = parentElement.lastElementChild;

    //remove child elements as long as they exist
    while (child) 
    {
        parentElement.removeChild(child);

        child = parentElement.lastElementChild;
    }

    return parentElement;
}

//6 listener for buttons in main ie to toggle comments
function addButtonListeners() 
{
    // Select all buttons in main
    const buttons = document.querySelectorAll('main button');

    // If buttons exist
    if (buttons.length > 0) 
    {
        // Loop through NodeList of buttons
        buttons.forEach((button) => {
            // Get postId from button.dataset.postId
            const postId = button.dataset.postId;

            // Check if postId exists & ≠empty string
            if (postId !== undefined && postId !== '') 
            {
                button.addEventListener('click', function(event) 
                {
                    toggleComments(event, postId);
                });
            }
        });
    }

    // Return button elements selected
    return buttons;
}


//7 undos #6
function removeButtonListeners() 
{
    const buttons = document.querySelectorAll('main button');

    // Button click handler
    function buttonClickHandler(event) 
    {
        const postId = event.target.dataset.postId;
        toggleComments(event, postId);
    }

    // Loop through NodeList of buttons
    buttons.forEach((button) => {
        // Gets postId from button.dataset.id
        const postId = button.dataset.postId;

        // If a postId exists, remove the click event listener from it
        if (postId) 
        {
            button.removeEventListener('click', buttonClickHandler);
        }
    });

    return buttons;
}


//8 creates comments from comments json 
function createComments(commentsData) 
{
    if (!commentsData) return undefined;

    const fragment = document.createDocumentFragment();

    // Loop through the comments
    commentsData.forEach((comment) => {
        
        //create article
        const articleElement = document.createElement('article');

        //create h3
        const h3Element = createElemWithText('h3', comment.name);

        // create para w/comment
        const bodyParagraph = createElemWithText('p', comment.body);

        // create para w/linked email
        const emailParagraph = createElemWithText('p', `From: ${comment.email}`);

        // Append the h3 and paragraphs to the article element
        articleElement.append(h3Element, bodyParagraph, emailParagraph)

        // Append the article element to the fragment
        fragment.appendChild(articleElement);
    });

    return fragment;
}


//9 populate dropdown w/userdata entries from JSON
function populateSelectMenu(usersData) 
{
    if (!usersData) return undefined;

    const selectMenu = document.getElementById('selectMenu');

    // Pass users JSON to createSelectOptions() dropdown
    const options = createSelectOptions(usersData);

    // Loop through options elements to add each to menu
    options.forEach((option) => {
        selectMenu.appendChild(option);
    });

    return selectMenu;
    }


//10 gets user json data
async function getUsers() 
{
    try {
        //request all users
        const response = await fetch('https://jsonplaceholder.typicode.com/users');

        const usersData = await response.json();

        // Return JSON data
        return usersData;
    } catch (error) {
        console.error('Error fetching users data:', error);
        throw error;
    }
}

//11 gets user posts data
async function getUserPosts(userId) 
{
    if (!userId) return undefined;
    try {
        // request posts for a specific user id
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);

        const userPostsData = await response.json();

        return userPostsData;
    } catch (error) {
        console.error(`Error fetching posts for user ${userId}:`, error);
        throw error;
    }
}

//12 retrieve user's corresponding id
async function getUser(userId) 
{
    if (!userId) return undefined;

    try {
        // request data for specific user id
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);

        const userData = await response.json();

        return userData;
    } catch (error) {
        console.error(`Error fetching user data for user ${userId}:`, error);
        throw error;
    }
}


//13 retrieve comments by postId
async function getPostComments(postId) 
{
    if (!postId) return undefined;

    try {
        // request comments for specific post id
        const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);

        const postCommentsData = await response.json();

        return postCommentsData;
    } catch (error) {
        console.error(`Error fetching comments for post ${postId}:`, error);
        throw error;
    }
}


//14 create section element, fetch post's comments, create element for comments & append to section
async function displayComments(postId) 
{
    // Check if postId parameter is provided
    if (!postId) return undefined;

    try {
        // Create a section element
        const section = document.createElement('section');

        section.dataset.postId = postId;

        // Add 'comments' & 'hide' classes
        section.classList.add('comments', 'hide');

        // get specific post's comments
        const comments = await getPostComments(postId);

        const fragment = createComments(comments);

        section.appendChild(fragment);

        // Return the section element
        return section;
    } catch (error) {
        console.error(`Error displaying comments for post ${postId}:`, error);
        throw error;
    }
}


//15 generate HTML elements (post details, author info...) for posts
async function createPosts(postsData) 
{
    // Check if postsData parameter is provided
    if (!postsData) return undefined;

    const fragment = document.createDocumentFragment();

    // Loop through posts data
    for (const post of postsData) 
    {
        // Create article element
        const articleElement = document.createElement('article');

        const h2Element = createElemWithText('h2', post.title);

        const bodyParagraph = createElemWithText('p', post.body);

        const postIdParagraph = createElemWithText('p', `Post ID: ${post.id}`);

        const author = await getUser(post.userId);

        // p element w/text of `Author: ${author.name} with ${author.company.name}`
        const authorInfoParagraph = createElemWithText('p', `Author: ${author.name} with ${author.company.name}`);

        // p element with company catchphrase
        const companyCatchPhraseParagraph = createElemWithText('p', `${author.company.catchPhrase}`);

        const showCommentsButton = createElemWithText('button', 'Show Comments');

        showCommentsButton.dataset.postId = post.id;

        // section equals result of await displayComments(post.id)
        const section = await displayComments(post.id);

        // Append to article
        articleElement.append(h2Element, bodyParagraph, postIdParagraph, authorInfoParagraph, companyCatchPhraseParagraph, showCommentsButton, section);

        // Append article to fragment
        fragment.appendChild(articleElement);
    }

return fragment;

}


//16 display elements from createPosts
async function displayPosts(postsData)
{
    // Select main element
    const mainElement = document.querySelector('main');

    //await createPosts(postsData) if postsData is true; otherwise, createElemWithText('p', 'Select an Employee to display their posts.', 'default-text')."
    const element = postsData ? await createPosts(postsData) : createElemWithText('p', 'Select an Employee to display their posts.', 'default-text');

    mainElement.appendChild(element);

    return element;
}


//17 PROBLEM RETURNING UNDEFINED
function toggleComments(event, postId) 
{
    if (!event || !postId) return;

    event.target.listener = true;

    // Assuming toggleCommentSection and toggleCommentButton return promises
    const section = toggleCommentSection(postId);
    const button = toggleCommentButton(postId);

    if (section && button) return [section, button];
    return;
}


//18 to refresh, clear children
async function refreshPosts(postsData) 
{
    if (!postsData) return undefined;

    const removeButtons = removeButtonListeners();

    // deleteChildElements of main element
    const mainElement = document.querySelector('main');
    const main = deleteChildElements(mainElement);

    // Pass posts JSON data to displayPosts to update
    const fragment = await displayPosts(postsData);

    const addButtons = addButtonListeners();

    // Return array of results
    return [removeButtons, main, fragment, addButtons];
}

//19 PROBLEM handle change event in dropdown (fetch posts for selected user, refresh posts, return info in array)
async function selectMenuChangeEventHandler(event) 
{
    if (!event || !event.target) return undefined;

    // Disable the select menu when called 
    const selectMenu = event.target;
    if (selectMenu) 
    {
        selectMenu.disabled = true;
    }

    try {
        //if userID exists, set its value otherwise defaults to 1
        const userId = selectMenu.value || 1;
        const posts = await getUserPosts(userId);

        // Pass posts JSON to refreshPosts
        const refreshPostsArray = await refreshPosts(posts);

        // Enable the select menu after getting results
        if (selectMenu) {
            selectMenu.disabled = false;
        }

        // Return array with userId, posts, and array returned from refreshPosts
        return [userId, posts].concat(refreshPostsArray);
    } catch (error) {
        console.error('Error in selectMenuChangeEventHandler:', error);
        throw error;
    }
}


//20  fetches user data, populates dropdown, returns array w/users JSON data & the select element
async function initPage() 
{
    try 
    {
    const users = await getUsers();

    // Pass users JSON data to populateSelectMenu
    const select = populateSelectMenu(users);

    // Return array w/users JSON data from getUsers & select element result from populateSelectMenu
    return [users, select];
    } catch (error) {
        console.error('Error in initPage:', error);
        throw error;
    }
}  

//21 initializes app by 1. preparing event handling for select menu and 2. logging results of change 
function initApp() 
{
    initPage().then(([users, select]) => 
    {
        // Select #selectMenu by id
        const selectMenu = document.getElementById('selectMenu');

        // event listener to #selectMenu for change event
        selectMenu.addEventListener('change', (event) => {
            // event listener should call selectMenuChangeEventHandler when the change event fires for the #selectMenu
            selectMenuChangeEventHandler(event).then((resultArray) => {
                // Handle the result as needed
                console.log('initApp result:', resultArray);
            }).catch((error) => {
                // Handle errors, e.g., log the error
                console.error('Error in initApp:', error);
            });
        });
    });
}


// Bonus Event listener to the document
document.addEventListener('DOMContentLoaded', function () 
{
    // Listen for the “DOMContentLoaded” event & call initApp after DOM content loads 
    initApp();
});
