let previousId = '';
let previousMenu = '';

function openSideMenu(id) {
    if (previousId) {
        document.getElementById(previousId).style.width = '0';
    }

    document.getElementById(id).style.width = '250px';
    previousId = id;
}

function closeSideMenu(id) {
    document.getElementById(id).style.width = '0';
}

function menuActivate(id) {
    if (previousMenu) {
        $('#' + previousMenu).removeClass('menu-active');
    }

    $('#' + id).addClass('menu-active');
    previousMenu = id;
}

let count = 0;

function showDropDown(id) {
    if (count === 0) {
        $('#' + id).css({ display: 'block', height: 'auto' });
        count = count + 1;
    } else {
        $('#' + id).css({ display: 'none' });
        count = 0;
    }
}

function showFab(id) {
    $('#' + id).css({ display: 'block' });
}

function closeFab(id) {
    $('#' + id).css({ display: 'none' });
}

let extraOptionCount = 0;

function showExtraOptions() {
    if (extraOptionCount === 0) {
        $('#extraOption').css({ display: 'block' });
        extraOptionCount = extraOptionCount + 1;
    } else {
        $('#extraOption').css({ display: 'none' });
        extraOptionCount = 0;
    }
}

function showAoi(id) {
    $('#' + id).css({ display: 'block' });
}

function closeAoi(id) {
    $('#' + id).css({ display: 'none' });
}

function openAoiForm(fieldId) {
    $('#' + fieldId).css({
        transition: '0.3s',
        display: 'none',
    });
    $('#aoiForm').css({
        display: 'block',
    });
}

$('#form').submit(function(e) {
    e.preventDefault();
    showToaster();
});

function showToaster() {
    $('#aoiForm').css({
        display: 'none',
    });
    $('#toaster').css({
        display: 'block',
    });
    autoHideToaster();
}

function autoHideToaster() {
    setTimeout(function() {
        $('#toaster').css({
            display: 'none',
        });
    }, 3000);
}

function hideToaster() {
    $('#toaster').css({
        display: 'none',
    });
}