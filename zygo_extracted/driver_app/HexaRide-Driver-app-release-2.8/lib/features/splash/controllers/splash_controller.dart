import 'dart:async';
import 'package:get/get.dart';
import 'package:ride_sharing_user_app/features/splash/domain/models/config_model.dart';
import 'package:ride_sharing_user_app/data/api_checker.dart';
import 'package:ride_sharing_user_app/features/splash/domain/services/splash_service_interface.dart';
import 'package:ride_sharing_user_app/util/app_constants.dart';
import 'package:url_launcher/url_launcher.dart';

class SplashController extends GetxController implements GetxService {
  final SplashServiceInterface splashServiceInterface;
  SplashController({required this.splashServiceInterface});

  ConfigModel? _config;

  ConfigModel? get config => _config;
  bool isShowToolTips = true;
  bool loading = false;
  Future<bool> getConfigData({bool reload= true}) async {
    loading = true;
    Response response = await splashServiceInterface.getConfigData();
    bool isSuccess = false;
    if(response.statusCode == 200) {
      isSuccess = true;
      loading = false;
      _config = ConfigModel.fromJson(response.body);
      await splashServiceInterface.saveConfigData(Map<String, dynamic>.from(response.body));
    }else {
      loading = false;
      final Map<String, dynamic>? cachedConfig = splashServiceInterface.getSavedConfigData();
      if (cachedConfig != null) {
        _config = ConfigModel.fromJson(cachedConfig);
        isSuccess = true;
      } else {
        _config = ConfigModel.fromJson(_buildFallbackConfig());
        isSuccess = true;
        ApiChecker.checkApi(response);
      }
    }
    if(reload){
      update();
    }
    return isSuccess;
  }

  Future<bool> initSharedData() {
    return splashServiceInterface.initSharedData();
  }



  Future<bool> removeSharedData() {
    return splashServiceInterface.removeSharedData();
  }

  final Uri params = Uri(
    scheme: 'mailto',
    path: '',
    query: 'subject=support Feedback&body=',
  );

  String capitalize(String s) => s[0].toUpperCase() + s.substring(1);

  Future<void> sendMailOrCall(String url, bool isMail) async {
    if (!await launchUrl(Uri.parse(isMail? params.toString() :url))) {
      throw 'Could not launch $url';
    }
  }


  String? _pusherConnectionStatus;
  String? get pusherConnectionStatus => _pusherConnectionStatus;

  void setPusherStatus(String? connection){
    _pusherConnectionStatus = connection;
  }


  bool haveOngoingRides() {
    return splashServiceInterface.haveOngoingRides();
  }

  void saveOngoingRides(bool value) {
    return splashServiceInterface.saveOngoingRides(value);
  }

  void addLastReFoundData(Map<String,dynamic>? data) => splashServiceInterface.addLastReFoundData(data);
  Map<String, dynamic>? getLastRefundData() => splashServiceInterface.getLastRefundData();

  void hideToolTips(){
    isShowToolTips = false;
  }

  Map<String, dynamic> _buildFallbackConfig() {
    return <String, dynamic>{
      'business_name': AppConstants.appName,
      'logo': '',
      'bid_on_fare': false,
      'country_code': 'IN',
      'business_address': '',
      'business_contact_phone': '',
      'business_contact_email': '',
      'business_support_phone': '',
      'business_support_email': '',
      'base_url': AppConstants.baseUrl,
      'websocket_url': '',
      'websocket_port': '6001',
      'websocket_key': '',
      'image_base_url': <String, dynamic>{
        'profile_image_customer': '',
        'profile_image_admin': '',
        'banner': '',
        'vehicle_category': '',
        'vehicle_model': '',
        'vehicle_brand': '',
        'profile_image': '',
        'identity_image': '',
        'documents': '',
        'pages': '',
        'conversation': '',
      },
      'currency_decimal_point': '2',
      'currency_code': 'INR',
      'currency_symbol_position': 'left',
      'currency_symbol': 'Rs.',
      'about_us': <String, dynamic>{
        'image': '',
        'name': 'About Us',
        'short_description': '',
        'long_description': '',
      },
      'privacy_policy': <String, dynamic>{
        'image': '',
        'name': 'Privacy Policy',
        'short_description': '',
        'long_description': '',
      },
      'terms_and_conditions': <String, dynamic>{
        'image': '',
        'name': 'Terms & Conditions',
        'short_description': '',
        'long_description': '',
      },
      'legal': <String, dynamic>{
        'image': '',
        'name': 'Legal',
        'short_description': '',
        'long_description': '',
      },
      'refund_policy': <String, dynamic>{
        'image': '',
        'name': 'Refund Policy',
        'short_description': '',
        'long_description': '',
      },
      'sms_verification': false,
      'email_verification': false,
      'map_api_key': AppConstants.polylineMapKey,
      'pagination_limit': 10,
      'facebook_login': false,
      'google_login': false,
      'verification': false,
      'conversion_status': false,
      'conversion_rate': 0,
      'otp_resend_time': 60,
      'self_registration': true,
      'review_status': false,
      'maintenance_mode': <String, dynamic>{
        'maintenance_status': 0,
        'selected_maintenance_system': <String, dynamic>{
          'user_app': 0,
          'driver_app': 0,
        },
        'maintenance_messages': <String, dynamic>{
          'business_number': 0,
          'business_email': 0,
          'maintenance_message': '',
          'message_body': '',
        },
        'maintenance_type_and_duration': <String, dynamic>{
          'maintenance_duration': '',
          'start_date': '',
          'end_date': '',
        },
      },
      'driver_completion_radius': 500.0,
      'is_demo': false,
      'level_status': false,
      'referral_earning_status': false,
      'return_time_for_driver': 24,
      'return_time_type_for_driver': 'hour',
      'parcel_return_time_fee_status': false,
      'return_fee_for_driver_time_exceed': 0,
      'app_minimum_version_for_android': 0.0,
      'app_minimum_version_for_ios': 0.0,
      'app_url_for_android': '',
      'app_url_for_ios': '',
      'firebase_otp_verification': false,
      'sms_gateway': false,
      'chatting_setup_status': false,
      'driver_question_answer_status': false,
      'websocket_scheme': 'https',
      'maximum_parcel_request_accept_limit_status_for_driver': false,
      'maximum_parcel_request_accept_limit_for_driver': 0,
      'parcel_weight_unit': 'kg',
      'safety_feature_status': false,
      'safety_feature_minimum_trip_delay_time': 60,
      'safety_feature_minimum_trip_delay_time_type': 'minute',
      'after_trip_completed_safety_feature_active_status': false,
      'after_trip_completed_safety_feature_set_time': 0,
      'safety_feature_emergency_govt_number': '',
      'fuel_types': <String>[],
      'otp_confirmation_for_trip': false,
      'cash_in_hand_setup_status': false,
      'cash_in_hand_max_amount_to_hold_cash': 0,
      'cash_in_hand_min_amount_to_pay': 0,
    };
  }

}
