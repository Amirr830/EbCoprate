import navbarKey from './../reducerKeys/navbarKey.json'
function NavbarReducer(prevState, action) {
    switch (action.type) {
        case navbarKey.toggleClick:
            prevState.Sidebar.toggle();
            return prevState;
        case navbarKey.refresh:
            return { ...prevState, refresh: !prevState?.refresh };
        default:
            return prevState
    }
}


// function openClick() {
//     sidebarObj.show();
// }

// // Toggle(Open/Close) the Sidebar
// function toggleClick() {
//     sidebarObj.toggle();
// }
// // Close the Sidebar
// function closeClick() {
//     sidebarObj.hide();
// }

// function onCreate() {
//     sidebarObj.element.style.visibility = '';
// }
// function open() {
//     console.log("Sidebar is opened");

// }
// function close() {
//     console.log("Sidebar is closed");
// }


export default NavbarReducer