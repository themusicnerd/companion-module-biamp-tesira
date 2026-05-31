export interface SubscriptionTemplate {
	id: string
	label: string
	attribute: string
	description: string
}

const makeId = (block: string, attribute: string): string =>
	`${block.toLowerCase().replace(/[^a-z0-9]+/g, '_')}__${attribute.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`

const makeTemplate = (block: string, attribute: string): SubscriptionTemplate => ({
	id: makeId(block, attribute),
	label: `${block}: ${attribute}`,
	attribute,
	description: `${block} subscription attribute from the Biamp Tesira subscription guide.`,
})

export const SUBSCRIPTION_TEMPLATES: SubscriptionTemplate[] = [
	makeTemplate('Audio Input', 'peakOccurring'),
	makeTemplate('Audio Input', 'allPeaks'),
	makeTemplate('CobraNet Input', 'bundleNumber'),
	makeTemplate('CobraNet Input', 'level'),
	makeTemplate('CobraNet Input', 'allLevels'),
	makeTemplate('CobraNet Input', 'mute'),
	makeTemplate('CobraNet Input', 'allMuteStates'),
	makeTemplate('CobraNet Input', 'peakOccurring'),
	makeTemplate('CobraNet Input', 'allPeaks'),
	makeTemplate('CobraNet Output', 'bundleNumber'),
	makeTemplate('CobraNet Output', 'level'),
	makeTemplate('CobraNet Output', 'allLevels'),
	makeTemplate('CobraNet Output', 'mute'),
	makeTemplate('CobraNet Output', 'allMuteStates'),
	makeTemplate('AEC', 'level'),
	makeTemplate('AEC', 'allLevels'),
	makeTemplate('AEC', 'allMeterStates'),
	makeTemplate('AEC', 'mute'),
	makeTemplate('AEC', 'allMuteStates'),
	makeTemplate('AEC Input', 'peakOccurring'),
	makeTemplate('AEC Input', 'allPeaks'),
	makeTemplate('AEC Input', 'phantomPowerOn'),
	makeTemplate('AEC Input', 'allPhantomPowerStates'),
	makeTemplate('ANC', 'allMeterStates'),
	makeTemplate('ANC Input', 'peakOccurring'),
	makeTemplate('ANC Input', 'allPeaks'),
	makeTemplate('ANC Input', 'phantomPowerOn'),
	makeTemplate('ANC Input', 'allPhantomPowerStates'),
	makeTemplate('Telephone Interface Receive', 'mute'),
	makeTemplate('VoIP Receive', 'mute'),
	makeTemplate('VoIP Call State', 'callState'),
	makeTemplate('DTMF', 'decodedDtmfData'),
	makeTemplate('Gain Sharing Auto Mixer', 'channelLevel'),
	makeTemplate('Gain Sharing Auto Mixer', 'allChannelLevels'),
	makeTemplate('Gain Sharing Auto Mixer', 'channelMute'),
	makeTemplate('Gain Sharing Auto Mixer', 'allChannelMutes'),
	makeTemplate('Gain Sharing Auto Mixer', 'crosspointOn'),
	makeTemplate('Gain Sharing Auto Mixer', 'allCrosspointStates'),
	makeTemplate('Gain Sharing Auto Mixer', 'gainReduction'),
	makeTemplate('Gain Sharing Auto Mixer', 'allGainReductions'),
	makeTemplate('Gain Sharing Auto Mixer', 'inputMute'),
	makeTemplate('Gain Sharing Auto Mixer', 'allInputMutes'),
	makeTemplate('Gain Sharing Auto Mixer', 'outputLevel'),
	makeTemplate('Gain Sharing Auto Mixer', 'outputMute'),
	makeTemplate('Compressor Limiter', 'gainReduction'),
	makeTemplate('Compressor Limiter', 'currentInputLevel'),
	makeTemplate('Compressor Limiter', 'inputSideChainLevels'),
	makeTemplate('Compressor Limiter', 'inputSideChainGainReductionLevels'),
	makeTemplate('Leveler', 'gainReduction'),
	makeTemplate('Noise Gate', 'gainReduction'),
	makeTemplate('AGC', 'allMeterStates'),
	makeTemplate('Source Selector', 'outputLevel'),
	makeTemplate('Source Selector', 'outputMute'),
	makeTemplate('Source Selector', 'sourceLevel'),
	makeTemplate('Source Selector', 'sourceSelection'),
	makeTemplate('Matrix Mixer', 'crosspoint'),
	makeTemplate('Matrix Mixer', 'crosspoints'),
	makeTemplate('Matrix Mixer', 'crosspointLevel'),
	makeTemplate('Level', 'level'),
	makeTemplate('Level', 'allLevels'),
	makeTemplate('Level', 'mute'),
	makeTemplate('Level', 'allMuteStates'),
	makeTemplate('Invert', 'invert'),
	makeTemplate('Invert', 'allInvertStates'),
	makeTemplate('Mute', 'mute'),
	makeTemplate('Mute', 'allMuteStates'),
	makeTemplate('Command String', 'commandStatus'),
	makeTemplate('Dialer', 'lastNumberDialed'),
	makeTemplate('Signal Present Meter', 'signalLevel'),
	makeTemplate('Signal Present Meter', 'allLevels'),
	makeTemplate('Signal Present Meter', 'signalPresent'),
	makeTemplate('Signal Present Meter', 'allSignalIndication'),
	makeTemplate('Audio Meter (Peak & RMS)', 'level'),
	makeTemplate('Audio Meter (Peak & RMS)', 'allLevels'),
	makeTemplate('Logic Meter', 'state'),
	makeTemplate('Logic Meter', 'allStates'),
]

export const SUBSCRIPTION_TEMPLATE_CHOICES = [
	{ id: 'custom', label: 'Custom attribute' },
	...SUBSCRIPTION_TEMPLATES.map((template) => ({
		id: template.id,
		label: template.label,
	})),
]

export function getTemplateById(id: string): SubscriptionTemplate | undefined {
	return SUBSCRIPTION_TEMPLATES.find((template) => template.id === id)
}
