package com.uktechservices.zygo

import android.content.ActivityNotFoundException
import android.content.Intent
import android.net.Uri
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.embedding.android.FlutterActivity
import io.flutter.plugin.common.MethodChannel
import java.net.URISyntaxException

class MainActivity: FlutterActivity() {
	private val paymentIntentChannel = "com.uktechservices.zygo/payment_intents"
	private val allowedPaymentPackages = setOf(
		"com.google.android.apps.nbu.paisa.user",
		"com.phonepe.app",
		"net.one97.paytm",
		"in.org.npci.upiapp",
		"in.amazon.mShop.android.shopping",
		"com.dreamplug.androidapp",
		"com.whatsapp",
		"com.whatsapp.w4b",
	)

	override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
		super.configureFlutterEngine(flutterEngine)
		MethodChannel(flutterEngine.dartExecutor.binaryMessenger, paymentIntentChannel)
			.setMethodCallHandler { call, result ->
				if (call.method != "launchPaymentIntent") {
					result.notImplemented()
					return@setMethodCallHandler
				}

				val url = call.argument<String>("url")
				if (url == null) {
					result.error("invalid_url", "Payment intent URL is missing", null)
					return@setMethodCallHandler
				}

				try {
					val intent = Intent.parseUri(url, Intent.URI_INTENT_SCHEME)
					val dataScheme = intent.data?.scheme?.lowercase()
					if (dataScheme !in setOf("upi", "phonepe", "tez", "paytmmp")) {
						result.error("invalid_scheme", "Unsupported payment intent", null)
						return@setMethodCallHandler
					}

					val targetPackage = intent.`package`
					if (targetPackage != null && targetPackage !in allowedPaymentPackages) {
						result.error("invalid_package", "Unsupported payment app", null)
						return@setMethodCallHandler
					}

					intent.action = Intent.ACTION_VIEW
					intent.component = null
					intent.selector = null
					intent.data = Uri.parse(intent.data.toString())
					startActivity(intent)
					result.success(true)
				} catch (_: ActivityNotFoundException) {
					result.success(false)
				} catch (_: URISyntaxException) {
					result.error("invalid_url", "Could not parse payment intent", null)
				}
			}
	}
}
