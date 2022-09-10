
import { IExecuteFunctions } from 'n8n-core';

import {
	IDataObject,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
	NodeOperationError
} from 'n8n-workflow';

import {
	googleApiRequestAllItems,
} from './GenericFunctions';

export class GoogleFirebaseCloudMessaging implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Google Firebase Cloud Messaging',
		name: 'googleFirebaseCloudMessaging',
		group: ['transform'],
		version: 1,
		description: 'Send Push Notifications via Google Firebase Cloud Messaging to Android, iOS and Web Apps',
		defaults: {
			name: 'Firebase Cloud Messaging',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'googleFirebaseCloudMessagingOAuth2Api',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Project Name or ID',
				name: 'projectId',
				type: 'string',
				default: '',
				typeOptions: {
					loadOptionsMethod: 'getProjects',
				},
				description:
					'As displayed in firebase console URL. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
				required: true,
			},
			{
				displayName: 'Token',
				name: 'token',
				type: 'string',
				default: '',
				placeholder: 'Placeholder value',
				description: 'Token',
			},
            {
				displayName: 'Title',
				name: 'text',
				type: 'string',
				default: '',
				placeholder: 'Placeholder value',
				description: 'The message text to send.',
			},
			{
				displayName: 'Text',
				name: 'title',
				type: 'string',
				default: '',
				placeholder: 'Placeholder value',
				description: 'The message text to send.',
			},
		],
	};

	methods = {
		loadOptions: {
			async getProjects(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const collections = await googleApiRequestAllItems.call(
					this,
					'results',
					'GET',
					'',
					{},
					{},
					'https://fcm.googleapis.com/v1/projects',
				);
				// @ts-ignore
				const returnData = collections.map((o) => ({
					name: o.projectId,
					value: o.projectId,
				})) as INodePropertyOptions[];
				return returnData;
			},
		},
	};
	
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		let item: INodeExecutionData;
		let title: string;

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				title = this.getNodeParameter('title', itemIndex, '') as string;
				item = items[itemIndex];



			} catch (error) {
				if (this.continueOnFail()) {
					items.push({ json: this.getInputData(itemIndex)[0].json, error, pairedItem: itemIndex });
				} else {
					if (error.context) {
						error.context.itemIndex = itemIndex;
						throw error;
					}
					throw new NodeOperationError(this.getNode(), error, {
						itemIndex,
					});
				}
			}
		}

		return this.prepareOutputData(items);
	}
}