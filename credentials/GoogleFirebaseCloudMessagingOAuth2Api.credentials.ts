import { ICredentialType, INodeProperties } from 'n8n-workflow';

const scopes = [
	'https://www.googleapis.com/auth/firebase.messaging',
];

export class GoogleFirebaseCloudMessagingOAuth2Api implements ICredentialType {
	name = 'googleFirebaseCloudMessagingOAuth2Api';
	extends = ['googleOAuth2Api'];
	displayName = 'Google Firebase Cloud Messaging OAuth2 API';
	documentationUrl = 'google';
	properties: INodeProperties[] = [
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'hidden',
			default: scopes.join(' '),
		},
	];
}