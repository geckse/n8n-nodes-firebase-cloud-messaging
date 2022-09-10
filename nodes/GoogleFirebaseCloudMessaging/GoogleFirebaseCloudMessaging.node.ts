
import { IExecuteFunctions } from 'n8n-core';
import {
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';


export class GoogleFirebaseCloudMessaging implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Google Firebase Cloud Messaging',
		name: 'googleFirebaseCloudMessaging',
		group: ['transform'],
		version: 1,
		description: 'Send Push Notifications to Android, iOS and Web Apps',
		defaults: {
			name: 'Google Firebase Cloud Messaging',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
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