import {EMPLOYEE, ADMIN} from '../../actions/role_action';
export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer',
      badge: {
        variant: 'info'
        // text: 'NEW'
      }
    },
    // {
    //   title: true,
    //   name: '',
    //   wrapper: {            // optional wrapper object
    //     element: '',        // required valid HTML5 element tag
    //     attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
    //   },
    //   class: ''             // optional class names space delimited list for title item ex: "text-center"
    // },
    {
        name: 'Activities',
        icon: 'circle-o',
        roles: [],
        children: [
            {
                name: 'Activity Minutes',
                url: '/activities/',
                icon: 'circle-o',
                roles: []
            },
            {
                name: 'Activity Timeseries',
                url: '/activities/timeserie',
                icon: 'circle-o',
                roles: []
            }
        ]
    },
    {
        name: 'Heartrate',
        url: '/heartrate',
        icon: 'circle-o',
        roles: []
    },
    {
        name: 'Sleep',
        url: '/sleep',
        icon: 'circle-o',
        roles: []
    },
    {
        name: 'EMA',
        url: '/ema',
        icon: 'circle-o',
        roles: []
    },
    {
      name: 'User Management',
      url: '/userManagement',
      icon: 'circle-o',
      roles: [ADMIN],
      children: [
        {
          name: 'Users',
          url: '/userManagement/users',
          icon: 'circle-o',
          roles: [ADMIN]
        },
        {
          name: 'Role',
          url: '/roleManagement/roles',
          icon: 'circle-o',
          roles: [ADMIN]
        },
      ]
    },
  ]
};
