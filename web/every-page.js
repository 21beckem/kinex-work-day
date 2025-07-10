// settings
const showDateCol = localStorage.getItem('KinexWorkDay_showDateCol') == 'true';
const Kinex_Role = localStorage.getItem('KinexWorkDay_role') || 'Cleaner';

// fill in navbar
if (document.querySelector('navbar')) {
    document.querySelector('navbar').innerHTML = `
        <button>
            <hamburger style="margin-right: 15px;"></hamburger> <span>${Kinex_Role}</span>
        </button>
        <img src="https://mma.prnewswire.com/media/1730057/Kinex_Logo.jpg?p=twitter" alt="Kinex Logo">
    `;
}

// fill in sidebar
if (document.querySelector('sidebar-container')) {
    document.querySelector('sidebar-container').innerHTML = `
        <deselect></deselect>
        <sidebar>
            <img src="https://mma.prnewswire.com/media/1730057/Kinex_Logo.jpg?p=twitter" alt="Kinex Logo">
            <h2>Pages</h2>
                <button onclick="location.href = 'index.html'"><h3>Go Home</h3></button>
            <h2>Options</h2>
                <button class="setRole" role="Cleaner"><h3>Enter Cleaner Role</h3></button>
                <button class="setRole" role="Repairer"><h3>Enter Repairer Role</h3></button>
                <button class="toggleDateCol"><h3>Toggle Date Column</h3></button>
        </sidebar>
    `;
    // event listeners
    document.querySelector('deselect').onclick = () => {
        document.querySelector('sidebar-container').classList.remove('active');
    }
    document.querySelector('button:has(hamburger)').onclick = () => {
        document.querySelector('sidebar-container').classList.add('active');
    }
    document.querySelectorAll('sidebar button.setRole').forEach(x => x.onclick = () => {
        document.querySelector('sidebar-container').classList.remove('active');
        localStorage.setItem('KinexWorkDay_role', x.getAttribute('role'));
        location.reload();
    });
    document.querySelector('sidebar button.toggleDateCol').onclick = () => {
        localStorage.setItem('KinexWorkDay_showDateCol', !showDateCol);
        location.reload();
    }
}

// fill in bottom drawer
if (document.querySelector('bottom-drawer-container')) {
    document.querySelector('bottom-drawer-container').innerHTML = `
        <deselect onclick="this.parentElement.classList.remove('active');"></deselect>
        <bottom-drawer-mover>
            <spacer style="height: 70vh;"></spacer>
            <bottom-drawer>
                <div class="title">Recent Activity</div>
                <recent-activity>
                    <activity></activity>
                </recent-activity>
            </bottom-drawer>
        </bottom-drawer-mover>
    `;
    // set handler to hide bottom drawer on scroll if you're scrolling fast enough
    const bottomDrawerMover = document.querySelector('bottom-drawer-mover');
    let lastBottomDrawerScrollPos = 0;
    bottomDrawerMover.addEventListener("scroll", (event) => {
        if (bottomDrawerMover.scrollTop < 1 && Math.abs(bottomDrawerMover.scrollTop - lastBottomDrawerScrollPos) > 20) {
            document.querySelector('bottom-drawer-container').classList.remove('active');
        }
        lastBottomDrawerScrollPos = bottomDrawerMover.scrollTop;
    });
}