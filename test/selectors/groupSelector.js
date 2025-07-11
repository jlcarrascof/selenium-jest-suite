module.exports = {
    profileIcon: 'div.menu-toggle.btn.btn-icon.rounded-full',
    logoutButton: '//button[contains(text(), "Log out")]',
    appsButton: '//*[@id="header_container"]/div[3]/div[2]/button',
    groupsOption: '//div[span[text()="Groups"]]',
    myProfileLink: '//*[@id="header_container"]/div[3]/div[3]/div/div[2]/div[3]/div/a',
    reportsLink: '//a[normalize-space()="Reports" and contains(@class, "flex") and contains(@href, "/tenant/groups/edit")]',
    calendarLink: '//a[normalize-space()="Calendar" and contains(@class, "flex") and contains(@href, "/calendar")]',
    resourcesLink: '//a[normalize-space()="Resources" and contains(@class, "flex") and contains(@href, "/resources")]',
    createGroupButton: 'button.bg-\\[\\#37b200\\].text-white.rounded-lg',
    groupFormTitle: '#modal-title',
    languagesRadios: 'input[formcontrolname="languages"]',
    gendersRadios: 'input[formcontrolname="genders"]',
};
