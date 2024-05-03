const navigation = () => {
  return [
    {
      title: 'Home',

      // badgeContent: '3',
      // badgeContent: 'New',
      action: 'read',
      subject: 'home',
      path: '/home',
      icon: 'tabler:smart-home'
    },
    {
      title: 'Invitations',
      action: 'read',
      subject: 'Invitation',
      path: '/invitation',
      icon: 'tabler:user-share'
    },
    {
      title: 'User Management',
      action: 'read',
      subject: 'User',
      path: '/user',
      icon: 'tabler:user-share'
    },
    {
      title: 'Gallery',
      action: 'read',
      subject: 'Gallery',
      icon: 'tabler:brand-appgallery',
      children: [
        {
          title: 'Add',
          action: 'create',
          subject: 'Gallery',
          path: '/gallery/add'
        },
        {
          title: 'List',
          action: 'read',
          subject: 'Gallery',
          path: '/gallery/list'
        }
      ]
    },
    {
      title: 'Settings',
      path: '/second-page',
      action: 'read',
      subject: 'setting-page',
      icon: 'tabler:settings',
      children: [
        {
          title: 'Roles & Responsibility',
          action: 'read',
          subject: 'roles-responsibility',
          icon: 'tabler:user-star',
          children: [
            {
              title: 'Permissions',
              path: '/settings/permissions',
              icon: 'tabler:lock-plus'
            },
            {
              title: 'Roles',
              path: '/settings/roles',
              icon: 'tabler:user-star'
            },
            {
              title: 'Responsibility',
              path: '/settings/responsibility',
              icon: 'tabler:lock-plus'
            }
          ]
        },
        {
          title: 'Event',
          action: 'read',
          subject: 'Event',
          path: '/settings/event',
          icon: 'tabler:calendar-event'
        }
      ]
    }
  ]
}

export default navigation
