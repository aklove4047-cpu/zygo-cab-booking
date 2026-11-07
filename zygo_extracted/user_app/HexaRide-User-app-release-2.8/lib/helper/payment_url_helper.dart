import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:url_launcher/url_launcher.dart';

class PaymentUrlHelper {
  PaymentUrlHelper._();

  static const MethodChannel _paymentIntentChannel =
      MethodChannel('com.uktechservices.zygo/payment_intents');

  static const Set<String> _webSchemes = {
    'http',
    'https',
    'about',
    'data',
    'javascript',
  };

  static bool shouldOpenExternally(String? url) {
    if (url == null || url.trim().isEmpty) {
      return false;
    }

    final uri = Uri.tryParse(url);
    final scheme = uri?.scheme.toLowerCase();
    return scheme != null && scheme.isNotEmpty && !_webSchemes.contains(scheme);
  }

  static Future<bool> openExternalPaymentApp(String? url) async {
    if (!shouldOpenExternally(url)) {
      return false;
    }

    final uri = Uri.tryParse(url!);
    if (uri == null) {
      return false;
    }

    try {
      if (defaultTargetPlatform == TargetPlatform.android &&
          uri.scheme.toLowerCase() == 'intent') {
        return await _paymentIntentChannel.invokeMethod<bool>(
              'launchPaymentIntent',
              {'url': uri.toString()},
            ) ??
            false;
      }
      return await launchUrl(uri, mode: LaunchMode.externalApplication);
    } catch (error) {
      if (kDebugMode) {
        print('Could not launch payment URL: $url, error: $error');
      }
      return false;
    }
  }
}
