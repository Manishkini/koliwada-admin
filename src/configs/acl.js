import { AbilityBuilder, Ability } from '@casl/ability'

export const AppAbility = Ability

/**
 * Please define your own Ability rules according to your app requirements.
 * We have just shown Admin and Client rules for demo purpose where
 * admin can manage everything and client can just visit ACL page
 */
const defineRulesFor = (role, subject) => {
  const adminObj = JSON.parse(window.localStorage.getItem('admin'))
  const { can, rules } = new AbilityBuilder(AppAbility)
  if (role === 'super_admin') {
    can('manage', 'all')
  } else {
    can(['read'], 'home')
    can(['read'], 'acl-page')
    if (adminObj.role.permissions.length) {
      for (let i = 0; i < adminObj.role.permissions.length; i++) {
        can(adminObj.role.permissions[i].actions, adminObj.role.permissions[i].subject)
      }
    }
  }

  // else {
  //   can(['read', 'create', 'update', 'delete'], subject)
  // }

  return rules
}

export const buildAbilityFor = (role, subject) => {
  return new AppAbility(defineRulesFor(role, subject), {
    // https://casl.js.org/v5/en/guide/subject-type-detection
    // @ts-ignore
    detectSubjectType: object => object.type
  })
}

export const defaultACLObj = {
  action: 'manage',
  subject: 'all'
}

export default defineRulesFor
