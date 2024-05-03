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
      icon: 'mingcute:invite-fill'
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
              action: 'read',
              subject: 'Permission',
              path: '/settings/permissions'
            },
            {
              title: 'Roles',
              action: 'read',
              subject: 'Role',
              path: '/settings/roles'
            },
            {
              title: 'Responsibility',
              action: 'read',
              subject: 'Responsibility',
              path: '/settings/responsibility'
            }
          ]
        },
        {
          title: 'Locations',
          action: 'read',
          subject: 'location',
          icon: 'tabler:location',
          children: [
            {
              title: 'State',
              action: 'read',
              subject: 'Location',
              path: '/settings/locations/state'
            },
            {
              title: 'District',
              action: 'read',
              subject: 'Location',
              path: '/settings/locations/district'
            },
            {
              title: 'Tehsil',
              action: 'read',
              subject: 'Location',
              path: '/settings/locations/tehsil'
            },
            {
              title: 'Village',
              action: 'read',
              subject: 'Location',
              path: '/settings/locations/village'
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
