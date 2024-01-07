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
      path: '/acl',
      action: 'read',
      subject: 'acl-page',
      title: 'Access Control',
      icon: 'tabler:shield'
    },
    {
      title: 'Settings',
      path: '/second-page',
      action: 'read',
      subject: 'setting-page',
      icon: 'tabler:settings',
      children: [
        {
          title: 'Roles',
          path: '/settings/roles',
          icon: 'tabler:user-star'
        },
        {
          title: 'Permissions',
          path: '/settings/permissions',
          icon: 'tabler:lock-plus'
        }
      ]
    }
  ]
}

export default navigation
