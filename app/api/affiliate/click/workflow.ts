// app/api/affiliate/click/comfy/workflow.ts

// This is your CyberDev.json workflow wrapped as a TS object
export const cyberDevWorkflow = {
  prompt: {
    "10": {
      "inputs": {
        "ckpt_name": "Juggernaut-XL_v9_RunDiffusionPhoto_v2.safetensors"
      },
      "class_type": "CheckpointLoaderSimple",
      "_meta": {
        "title": "Load Checkpoint"
      }
    },
    "11": {
      "inputs": {
        "text": "hyper-realistic portrait of a smiling young woman with big blonde pigtails wearing a pink dress, standing in a colorful field, soft studio lighting, 4k, highly detailed, cinematic, flux style",
        "clip": [
          "10",
          1
        ]
      },
      "class_type": "CLIPTextEncode",
      "_meta": {
        "title": "CLIP Text Encode (Prompt)"
      }
    },
    "14": {
      "inputs": {
        "text": "blurry, low resolution, distorted face, extra limbs, text, watermark, oversaturated, jpeg artifacts",
        "clip": [
          "10",
          1
        ]
      },
      "class_type": "CLIPTextEncode",
      "_meta": {
        "title": "CLIP Text Encode (Prompt)"
      }
    },
    "17": {
      "inputs": {
        "ip_scale": 0.93,
        "ip_adapter_flux": [
          "18",
          0
        ],
        "image": [
          "19",
          0
        ]
      },
      "class_type": "ApplyFluxIPAdapter",
      "_meta": {
        "title": "Apply Flux IPAdapter"
      }
    },
    "18": {
      "inputs": {
        "ipadatper": "ip_adapter.safetensors",
        "clip_vision": "clip_vision_flux.safetensors",
        "provider": "GPU"
      },
      "class_type": "LoadFluxIPAdapter",
      "_meta": {
        "title": "Load Flux IPAdatpter"
      }
    },
    "19": {
      "inputs": {
        "image": "example.png"
      },
      "class_type": "LoadImage",
      "_meta": {
        "title": "Load Image"
      }
    },
    "20": {
      "inputs": {
        "seed": 995294525731129,
        "steps": 20,
        "cfg": 8,
        "sampler_name": "euler",
        "scheduler": "simple",
        "denoise": 1,
        "model": [
          "10",
          0
        ],
        "positive": [
          "11",
          0
        ],
        "negative": [
          "14",
          0
        ],
        "latent_image": [
          "21",
          0
        ]
      },
      "class_type": "KSampler",
      "_meta": {
        "title": "KSampler"
      }
    },
    "21": {
      "inputs": {
        "width": 512,
        "height": 512,
        "batch_size": 1
      },
      "class_type": "EmptyLatentImage",
      "_meta": {
        "title": "Empty Latent Image"
      }
    },
    "22": {
      "inputs": {
        "samples": [
          "20",
          0
        ],
        "vae": [
          "10",
          2
        ]
      },
      "class_type": "VAEDecode",
      "_meta": {
        "title": "VAE Decode"
      }
    },
    "23": {
      "inputs": {
        "filename_prefix": "ComfyUI",
        "images": [
          "22",
          0
        ]
      },
      "class_type": "SaveImage",
      "_meta": {
        "title": "Save Image"
      }
    }
  }
} as const;
