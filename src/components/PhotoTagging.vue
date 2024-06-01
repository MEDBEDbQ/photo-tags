<script setup lang="ts">

import { ref } from "vue";
import { Cropper, type CropperResult } from "vue-advanced-cropper";

const imgOriginal = ref('https://images.unsplash.com/photo-1600984575359-310ae7b6bdf2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=80')

const imgCrop = ref('');

const API_XIMILAR = ref('');

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
		})
		.catch(err => {
			console.error("Error: ")
			console.error(err)
		})
}
</script>

<template>
	<div class="key_form">
		<input v-model="API_XIMILAR">
		<button class="send_button" @click="sendToXimilar">
			Send to Ximilar
			<span></span>
			<span></span>
			<span></span>
			<span></span>
		</button>
	</div>
	<div>
		<cropper class="cropper" :src="imgOriginal" :stencil-props="{
			aspectRatio: 10 / 12
		}" @change="change" />
	</div>
	<div>
		<img :src="imgCrop">
	</div>

</template>

<style scoped></style>