import 'dart:convert';
import 'package:get/get.dart';
import 'package:ride_sharing_user_app/features/auth/screens/sign_up_screen.dart';
import 'package:ride_sharing_user_app/features/dashboard/screens/dashboard_screen.dart';
import 'package:ride_sharing_user_app/features/splash/screens/splash_screen.dart';

class RouteHelper {
  static const String initial = '/';
  static const String splash = '/splash';
  static const String home = '/home';

  static String getSplashRoute({Map<String, dynamic>? notificationData}) {
    final Map<String, dynamic>? sanitizedNotification = notificationData == null
        ? null
        : Map<String, dynamic>.from(notificationData)
      ?..remove('body');

    final String userName =
        (sanitizedNotification?['user_name'] ?? '').toString();
    sanitizedNotification?.remove('user_name');

    final Map<String, String> queryParameters = <String, String>{
      if (sanitizedNotification != null)
        'notification': jsonEncode(sanitizedNotification),
      if (userName.isNotEmpty) 'userName': userName,
    };

    final Uri uri = Uri(
        path: splash,
        queryParameters: queryParameters.isEmpty ? null : queryParameters);
    return uri.toString();
  }

  static List<GetPage> routes = [
    GetPage(name: initial, page: () => const SignUpScreen()),
    GetPage(
        name: splash,
        page: () => SplashScreen(
            notificationData:
                _parseNotificationData(Get.parameters['notification']),
            userName: Get.parameters['userName'])),
    GetPage(name: home, page: () => const DashboardScreen()),
  ];

  static Map<String, dynamic>? _parseNotificationData(String? notification) {
    if (notification == null ||
        notification.isEmpty ||
        notification == 'null') {
      return null;
    }

    final dynamic decoded = jsonDecode(notification);
    if (decoded is Map<String, dynamic>) {
      return decoded;
    }
    if (decoded is Map) {
      return Map<String, dynamic>.from(decoded);
    }

    return null;
  }
}
