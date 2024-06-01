<script setup lang="ts">

import { ref } from "vue";
import { Cropper, type CropperResult } from "vue-advanced-cropper";

const imgOriginal = ref('https://images.unsplash.com/photo-1600984575359-310ae7b6bdf2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=80')

const imgCrop = ref('');

const API_XIMILAR = ref('');

const tags = ref(new Array<String>());

const change = ({ coordinates, canvas }: CropperResult): void => {
	console.log(coordinates, canvas);
	if (canvas == undefined)
		return;
	imgCrop.value = canvas.toDataURL()
	console.debug(imgCrop.value)
}

const sendToXimilar = () => {
	console.debug(API_XIMILAR.value)
	console.log(imgCrop.value)

	fetch('https://api.ximilar.com/photo/tags/v2/tags', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': 'Token ' + API_XIMILAR.value
		},
		body: JSON.stringify({
			"lang": "en",
			"tagging_mode": "simple",
			"records": [
				{ "_base64": imgCrop.value }
			]
		})
	}).then(res => {
		return res.json()
	})
		.then(data => {
			console.log(data)
			tags.value = data.records[0]._tags_simple;
			console.log(tags.value)
		})
		.catch(err => {
			console.error("Error: ")
			console.error(err)
		})
}

interface HTMLInputEvent extends Event {
	target: HTMLInputElement & EventTarget
}

const uploadPhoto = (event: HTMLInputEvent) => {
	let files = (event as HTMLInputEvent).target.files;
	if (!files || !files.length) return
	if (files[0] != null) {
		if (imgOriginal.value != null) {
			URL.revokeObjectURL(imgOriginal.value)
		}
		const blob = URL.createObjectURL(files[0]);

		const reader = new FileReader();
		reader.onload = (e) => {
			return imgOriginal.value = blob;
		};
		reader.readAsArrayBuffer(files[0]);
	}
}



</script>

<template>

	<div class="flex_container">
		<div class="width_50 cropper_container">
			<p class="promt">Select a photo fragment</p>
			<cropper class="cropper" :src="imgOriginal" :stencil-props="{
			}" @change="change" />
			<button class="upload_button" onclick="document.getElementById('uploadFileInput').click()">
				<svg width="180px" height="60px" viewBox="0 0 180 60" class="border">
					<polyline points="179,1 179,59 1,59 1,1 179,1" class="bg-line" />
					<polyline points="179,1 179,59 1,59 1,1 179,1" class="hl-line" />
				</svg>
				<span>Upload your photo</span>
			</button>
			<input id="uploadFileInput" type="file" accept="image/*" class="display_none" @change="uploadPhoto" />
		</div>
		<div class="width_40">
			<div class="img_crop_container">
				<img class="img_crop" :src="imgCrop">
				<p class="tags" v-if="tags != undefined && tags.length != 0">Tags: {{ tags.join(', ') }}</p>
			</div>
			<div class="key_form">
				<p class="promt">Please enter your API key. You can get it <a href="https://app.ximilar.com">here</a>.
				</p>
				<input v-model="API_XIMILAR">
				<button class="send_button" @click="sendToXimilar">
					Send to Ximilar
					<span></span>
					<span></span>
					<span></span>
					<span></span>
				</button>
			</div>
		</div>
	</div>
</template>

<style scoped></style>