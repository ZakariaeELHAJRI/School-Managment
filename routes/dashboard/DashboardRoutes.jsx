import { v4 as uuid } from 'uuid';

export const DashboardMenu = [
	{
		id: uuid(),
		title: 'لوحة القيادة',
		icon: 'home',
		link: '/'
	},
	{
		id: uuid(),
		title: 'المستويات الدراسية ',
		icon: 'bar-chart',
		link: '/levels'
	},
	// {
	// 	id: uuid(),
	// 	title: 'المواد',
	// 	icon: 'book-open',
	// 	link: '/subjects'
	// },
	// {
	// 	id: uuid(),
	// 	title: 'الدورات',
	// 	icon: 'book',
	// 	link: '/courses'
	// },
	{
		id: uuid(),
		title: 'الأساتدة',
		icon: 'users',
		link: '/teachers'
	},
	// {
	// 	id: uuid(),
	// 	title: 'الطلاب',
	// 	icon: 'users',
	// 	link: '/students'
	// },
	// ,
	{
		id: uuid(),
		title: 'الطالب',
		icon: 'user',
		link: '/student'
	},
	{
		id: uuid(),
		title: 'الدورات',
		icon: 'layers',
		link: '/formations'
	},
	{
		id: uuid(),
		title: 'المسابقات',
		icon: 'award',
		link: '/competitions'
	},
	{
		id: uuid(),
		title: 'الموافقات',
		icon: 'check-square',
		children: [
			{ id: uuid(), link: '/overview', name: 'نظرة عامة' },
			{ id: uuid(), link: '/approvals-managment', name: 'إدارة الموافقات' }
		]
	},
	
];
