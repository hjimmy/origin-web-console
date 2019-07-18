'use strict';
/* jshint unused: false */

/**
 * @ngdoc overview
 * @name openshiftConsole
 * @description
 * # openshiftConsole
 *
 * Main module of the application.
 */
angular
  .module('openshiftConsole', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'kubernetesUI',
    'registryUI.images',
    'ui.bootstrap',
    'patternfly.charts',
    'patternfly.navigation',
    'patternfly.sort',
    'patternfly.notification',
    'openshiftConsoleTemplates',
    'ui.ace',
    'extension-registry',
    'as.sortable',
    'ui.select',
    'angular-inview',
    'angularMoment',
    'ab-base64',
    'openshiftCommonServices',
    'openshiftCommonUI',
    'webCatalog',
    'gettext'
  ])
  .config(function ($routeProvider, $uibModalProvider, HomePagePreferenceServiceProvider) {
    var landingPageRoute;
    var projectsPageRoute = {
      templateUrl: 'views/projects.html',
      controller: 'ProjectsController'
    };
    if (_.get(window, 'OPENSHIFT_CONSTANTS.DISABLE_SERVICE_CATALOG_LANDING_PAGE')) {
      landingPageRoute = projectsPageRoute;
    } else {
      landingPageRoute = {
        templateUrl: 'views/landing-page.html',
        controller: 'LandingPageController',
        reloadOnSearch: false
      };
    }
    $routeProvider.when('/projects', projectsPageRoute);
    $routeProvider
      .when('/', {
        redirectTo: function() {
          return HomePagePreferenceServiceProvider.$get().getHomePagePath();
        }
      })
      .when('/catalog', landingPageRoute)
      .when('/create-project', {
        templateUrl: 'views/create-project.html',
        controller: 'CreateProjectController'
      })
      .when('/project/:project/catalog', {
        templateUrl: 'views/project-browse-catalog.html',
        controller: 'ProjectBrowseCatalogController'
      })
      .when('/project/:project', {
        redirectTo: function(params) {
          return '/project/' + encodeURIComponent(params.project) + "/overview";
        }
      })
      .when('/project/:project/overview', {
        templateUrl: 'views/overview.html',
        controller: 'OverviewController',
        controllerAs: 'overview',
        reloadOnSearch: false
      })
      .when('/project/:project/quota', {
        templateUrl: 'views/quota.html',
        controller: 'QuotaController'
      })
      .when('/project/:project/monitoring', {
        templateUrl: 'views/monitoring.html',
        controller: 'MonitoringController',
        reloadOnSearch: false
      })
      .when('/project/:project/membership', {
        templateUrl: 'views/membership.html',
        controller: 'MembershipController',
        reloadOnSearch: false
      })
      .when('/project/:project/browse', {
        redirectTo: function(params) {
          return '/project/' + encodeURIComponent(params.project) + "/browse/pods";  // TODO decide what subtab to default to here
        }
      })
      .when('/project/:project/browse/builds', {
        templateUrl: 'views/builds.html',
        controller: 'BuildsController',
        reloadOnSearch: false
      })
      .when('/project/:project/browse/pipelines', {
        templateUrl: 'views/pipelines.html',
        controller: 'PipelinesController'
      })
      .when('/project/:project/browse/builds/:buildconfig', {
        templateUrl: 'views/browse/build-config.html',
        controller: 'BuildConfigController',
        reloadOnSearch: false
      })
      .when('/project/:project/browse/pipelines/:buildconfig', {
        templateUrl: 'views/browse/build-config.html',
        controller: 'BuildConfigController',
        resolve: {
          isPipeline: function ($route) {
            $route.current.params.isPipeline = true;
          }
        },
        reloadOnSearch: false
      })
      .when('/project/:project/edit/yaml', {
        templateUrl: 'views/edit/yaml.html',
        controller: 'EditYAMLController'
      })
      .when('/project/:project/edit/builds/:buildconfig', {
        templateUrl: 'views/edit/build-config.html',
        controller: 'EditBuildConfigController'
      })
      .when('/project/:project/edit/pipelines/:buildconfig', {
        templateUrl: 'views/edit/build-config.html',
        controller: 'EditBuildConfigController',
        resolve: {
          isPipeline: function ($route) {
            $route.current.params.isPipeline = true;
          }
        },
        reloadOnSearch: false
      })
      .when('/project/:project/browse/builds/:buildconfig/:build', {
        templateUrl: function(params) {
          if (params.view === 'chromeless') {
            return 'views/logs/chromeless-build-log.html';
          }

          return 'views/browse/build.html';
        },
        controller: 'BuildController',
        reloadOnSearch: false
      })
      .when('/project/:project/browse/pipelines/:buildconfig/:build', {
        templateUrl: 'views/browse/build.html',
        controller: 'BuildController',
        resolve: {
          isPipeline: function ($route) {
            $route.current.params.isPipeline = true;
          }
        },
        reloadOnSearch: false
      })
      // For when a build is missing a buildconfig label
      // Needs to still be prefixed with browse/builds so the secondary nav active state is correct
      .when('/project/:project/browse/builds-noconfig/:build', {
        templateUrl: 'views/browse/build.html',
        controller: 'BuildController',
        reloadOnSearch: false
      })
      .when('/project/:project/browse/pipelines-noconfig/:build', {
        templateUrl: 'views/browse/build.html',
        controller: 'BuildController',
        resolve: {
          isPipeline: function ($route) {
            $route.current.params.isPipeline = true;
          }
        },
        reloadOnSearch: false
      })
      .when('/project/:project/browse/deployments', {
        templateUrl: 'views/deployments.html',
        controller: 'DeploymentsController',
        reloadOnSearch: false
      })
      // Can't be /deployments/ (plural) because we used that previously for deployment config URLs. See redirect below.
      .when('/project/:project/browse/deployment/:deployment', {
        templateUrl: 'views/browse/deployment.html',
        controller: 'DeploymentController',
        reloadOnSearch: false
      })
      .when('/project/:project/browse/dc/:deploymentconfig', {
        templateUrl: 'views/browse/deployment-config.html',
        controller: 'DeploymentConfigController',
        reloadOnSearch: false
      })
      .when('/project/:project/edit/dc/:deploymentconfig', {
        templateUrl: 'views/edit/deployment-config.html',
        controller: 'EditDeploymentConfigController'
      })
      .when('/project/:project/browse/stateful-sets/', {
        templateUrl: 'views/browse/stateful-sets.html',
        controller: 'StatefulSetsController',
        reloadOnSearch: false
      })
      .when('/project/:project/browse/stateful-sets/:statefulset', {
        templateUrl: 'views/browse/stateful-set.html',
        controller: 'StatefulSetController',
        reloadOnSearch: false
      })
      .when('/project/:project/browse/rs/:replicaSet', {
        templateUrl: 'views/browse/replica-set.html',
        resolve: {
          // The ReplicaSetController handles both ReplicaSet and ReplicationController.
          kind: function () {
            return 'ReplicaSet';
          }
        },
        controller: 'ReplicaSetController',
        reloadOnSearch: false
      })
      .when('/project/:project/browse/rc/:replicaSet', {
        templateUrl: function(params) {
          if (params.view === 'chromeless') {
            return 'views/logs/chromeless-deployment-log.html';
          }

          return 'views/browse/replica-set.html';
        },
        resolve: {
          // The ReplicaSetController handles both ReplicaSet and ReplicationController.
          kind: function () {
            return 'ReplicationController';
          }
        },
        controller: 'ReplicaSetController',
        reloadOnSearch: false
      })
      .when('/project/:project/browse/events', {
        templateUrl: 'views/events.html',
        controller: 'EventsController'
      })
      .when('/project/:project/browse/images', {
        templateUrl: 'views/images.html',
        controller: 'ImagesController',
        reloadOnSearch: false
      })
      .when('/project/:project/browse/images/:imagestream', {
        templateUrl: 'views/browse/imagestream.html',
        controller: 'ImageStreamController'
      })
      .when('/project/:project/browse/images/:imagestream/:tag', {
        templateUrl: 'views/browse/image.html',
        controller: 'ImageController',
        reloadOnSearch: false
      })
      .when('/project/:project/browse/pods', {
        templateUrl: 'views/pods.html',
        controller: 'PodsController',
        reloadOnSearch: false
      })
      .when('/project/:project/browse/pods/:pod', {
        templateUrl: function(params) {
          if (params.view === 'chromeless') {
            return 'views/logs/chromeless-pod-log.html';
          }

          return 'views/browse/pod.html';
        },
        controller: 'PodController',
        reloadOnSearch: false
      })
      .when('/project/:project/browse/services', {
        templateUrl: 'views/services.html',
        controller: 'ServicesController',
        reloadOnSearch: false
      })
      .when('/project/:project/browse/services/:service', {
        templateUrl: 'views/browse/service.html',
        controller: 'ServiceController',
        reloadOnSearch: false
      })
      .when('/project/:project/browse/service-instances', {
        templateUrl: 'views/service-instances.html',
        controller: 'ServiceInstancesController',
        reloadOnSearch: false
      })
      .when('/project/:project/browse/service-instances/:instance', {
        templateUrl: 'views/browse/service-instance.html',
        controller: 'ServiceInstanceController',
        reloadOnSearch: false
      })
      .when('/project/:project/browse/storage', {
        templateUrl: 'views/storage.html',
        controller: 'StorageController',
        reloadOnSearch: false
      })
      .when('/project/:project/browse/secrets/:secret', {
        templateUrl: 'views/browse/secret.html',
        controller: 'SecretController',
        reloadOnSearch: false
      })
      .when('/project/:project/browse/secrets', {
        templateUrl: 'views/secrets.html',
        controller: 'SecretsController',
        reloadOnSearch: false
      })
      .when('/project/:project/create-secret', {
        templateUrl: 'views/create-secret.html',
        controller: 'CreateSecretController'
      })
      .when('/project/:project/browse/config-maps', {
        templateUrl: 'views/browse/config-maps.html',
        controller: 'ConfigMapsController',
        reloadOnSearch: false
      })
      .when('/project/:project/browse/config-maps/:configMap', {
        templateUrl: 'views/browse/config-map.html',
        controller: 'ConfigMapController'
      })
      .when('/project/:project/create-config-map', {
        templateUrl: 'views/create-config-map.html',
        controller: 'CreateConfigMapController'
      })
      .when('/project/:project/edit/config-maps/:configMap', {
        templateUrl: 'views/edit/config-map.html',
        controller: 'EditConfigMapController'
      })
      .when('/project/:project/browse/other', {
        templateUrl: 'views/other-resources.html',
        controller: 'OtherResourcesController',
        reloadOnSearch: false
      })
      .when('/project/:project/browse/persistentvolumeclaims/:pvc', {
        templateUrl: 'views/browse/persistent-volume-claim.html',
        controller: 'PersistentVolumeClaimController'
      })
      .when('/project/:project/browse/routes', {
        templateUrl: 'views/browse/routes.html',
        controller: 'RoutesController',
        reloadOnSearch: false
      })
      .when('/project/:project/edit/routes/:route', {
        templateUrl: 'views/edit/route.html',
        controller: 'EditRouteController'
      })
      .when('/project/:project/browse/routes/:route', {
        templateUrl: 'views/browse/route.html',
        controller: 'RouteController'
      })
      .when('/project/:project/create-route', {
        templateUrl: 'views/create-route.html',
        controller: 'CreateRouteController'
      })
      .when('/project/:project/edit', {
        templateUrl: 'views/edit/project.html',
        controller: 'EditProjectController'
      })
      .when('/project/:project/create-pvc', {
        templateUrl: 'views/create-persistent-volume-claim.html',
        controller: 'CreatePersistentVolumeClaimController'
      })
      .when('/project/:project/attach-pvc', {
        templateUrl: 'views/attach-pvc.html',
        controller: 'AttachPVCController'
      })
      .when('/project/:project/add-config-volume', {
        templateUrl: 'views/add-config-volume.html',
        controller: 'AddConfigVolumeController'
      })
      .when('/project/:project/create', {
        templateUrl: 'views/create.html',
        controller: 'CreateController',
        reloadOnSearch: false
      })
      .when('/project/:project/create/category/:category', {
        templateUrl: 'views/create/category.html',
        controller: 'BrowseCategoryController'
      })
      .when('/project/:project/create/category/:category/:subcategory', {
        templateUrl: 'views/create/category.html',
        controller: 'BrowseCategoryController'
      })
      .when('/project/:project/create/fromtemplate', {
        templateUrl: 'views/newfromtemplate.html',
        controller: 'NewFromTemplateController'
      })
      .when('/project/:project/create/fromimage', {
        templateUrl: 'views/create/fromimage.html',
        controller: 'CreateFromImageController'
      })
      .when('/project/:project/create/next', {
        templateUrl: 'views/create/next-steps.html',
        controller: 'NextStepsController'
      })
      .when('/project/:project/set-limits', {
        templateUrl: 'views/set-limits.html',
        controller: 'SetLimitsController'
      })
      .when('/project/:project/edit/autoscaler', {
        templateUrl: 'views/edit/autoscaler.html',
        controller: 'EditAutoscalerController'
      })
      .when('/project/:project/edit/health-checks', {
        templateUrl: 'views/edit/health-checks.html',
        controller: 'EditHealthChecksController'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutController'
      })
      .when('/command-line', {
        templateUrl: 'views/command-line.html',
        controller: 'CommandLineController'
      })
      .when('/oauth', {
        templateUrl: 'views/util/oauth.html',
        controller: 'OAuthController'
      })
      .when('/error', {
        templateUrl: 'views/util/error.html',
        controller: 'ErrorController'
      })
      .when('/logout', {
        templateUrl: 'views/util/logout.html',
        controller: 'LogoutController'
      })
      .when('/create', {
        templateUrl: 'views/create-from-url.html',
        controller: 'CreateFromURLController'
      })
      // legacy redirects
      .when('/createProject', {
        redirectTo: '/create-project'
      })
      .when('/project/:project/createRoute', {
        redirectTo: '/project/:project/create-route'
      })
      .when('/project/:project/attachPVC', {
        redirectTo: '/project/:project/attach-pvc'
      })
      .when('/project/:project/browse/deployments/:deploymentconfig', {
        redirectTo: '/project/:project/browse/dc/:deploymentconfig'
      })
      .when('/project/:project/browse/deployments/:deploymentconfig/:rc', {
        redirectTo: '/project/:project/browse/rc/:rc'
      })
      .when('/project/:project/browse/deployments-replicationcontrollers/:rc', {
        redirectTo: '/project/:project/browse/rc/:rc'
      })
      .otherwise({
        redirectTo: '/'
      });

    $uibModalProvider.options = {
      animation: true,
      backdrop: 'static' // do not allow close of modal by clicking backdrop
    };
  })
  .constant("LOGGING_URL", _.get(window.OPENSHIFT_CONFIG, "loggingURL"))
  .constant("METRICS_URL", _.get(window.OPENSHIFT_CONFIG, "metricsURL"))
  // A (very) basic regex to determine if a URL is an absolute URL, enough to
  // warn the user the Git URL probably won't work. This should only be used
  // as a sanity test and shouldn't block submitting the form. Rely on the API
  // server for any additional validation.
  .constant('SOURCE_URL_PATTERN', /^[a-z][a-z0-9+.-@]*:(\/\/)?[0-9a-z_-]+/i)
  // RELATIVE_PATH_PATTERN matches any paths not starting with `/` or
  // containing `..` as path elements. Use negative lookaheads to assert that
  // the value does not match those patterns.
  //
  //   (?!\/)                do not match strings starting with `/`
  //   (?!\.\.(\/|$))        do not match strings starting with `../` or exactly `..`
  //   (?!.*\/\.\.(\/|$))    do not match strings containing `/../` or ending in `/..`
  .constant('RELATIVE_PATH_PATTERN', /^(?!\/)(?!\.\.(\/|$))(?!.*\/\.\.(\/|$)).*$/)
  // http://stackoverflow.com/questions/5899783/detect-safari-using-jquery
  .constant('IS_SAFARI', /Version\/[\d\.]+.*Safari/.test(navigator.userAgent))
  .constant('amTimeAgoConfig', {
    // Set the title attribute to a localized time format like "September 4 1986 8:30 PM"
    // See http://momentjs.com/docs/#/displaying/format/
    titleFormat: 'LLL'
  })
  .config(function(kubernetesContainerSocketProvider) {
    // Configure the container terminal
    kubernetesContainerSocketProvider.WebSocketFactory = "ContainerWebSocket";
  })
  .config(function($compileProvider){
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|mailto|git):/i);
  })
  .run(function($rootScope, LabelFilter){
    // assume we always want filterState persisted, pages that dont can turn it off
    LabelFilter.persistFilterState(true);
    $rootScope.$on('$routeChangeSuccess', function() {
      LabelFilter.readPersistedState();
    });
  })
  .run(function($location, $uibModal, AuthService) {
    var INACTIVITY_TIMEOUT_MINUTES = window.OPENSHIFT_CONFIG.inactivityTimeoutMinutes;
    if (!INACTIVITY_TIMEOUT_MINUTES) {
      return;
    }
    var lastInteractionKey = 'origin-web-console-last-interaction-timestamp';
    var inactivityLogoutKey = 'origin-web-console-inactivity-logout';
    var isLocalLogoutModalShown = false;
    var checkInteractionInterval;
    var modalInstance;
    // Interval that will check for user inactivity every minute.
    // In case the last interaction is higher than INACTIVITY_TIMEOUT_MINUTES a logout modal will be shown.
    // Also check for 'origin-web-console-inactivity-logout' object in the local storage, that indicates that the
    // user has been already logged out, in case of multiple opened console tabs.
    var startInteractionIntervalCheck = function () {
      checkInteractionInterval = setInterval(function(){
        if (!AuthService.isLoggedIn()) {
          return;
        }
        var lastInteraction = Date.parse(localStorage.getItem(lastInteractionKey));
        if (isNaN(lastInteraction)) {
          Logger.warn("Last interaction timestamp has been corrupted. The logout timeout will be restarted.");
          lastInteraction = new Date();
        }
        var currentTime = new Date();
        // Since the INACTIVITY_TIMEOUT_MINUTES is set in minutes it needs to be converted into milliseconds.
        if (currentTime - lastInteraction > INACTIVITY_TIMEOUT_MINUTES * 60000) {
          showLogoutModal();
        }
      }, 60000);
    };

    // In case of multiple opened tabs the interval needs to be restarted everytime there is any activity in any tab,
    // so all intervals are synced, and they start the counting at the same time.
    var restartCheckInteractionInterval = function() {
      // Handles cases of user activity during the opened modal, where user clicks inside the modal but not on the buttons.
      if (modalInstance) {
        modalInstance.dismiss("User activity");
        modalInstance = null;
      }
      clearInterval(checkInteractionInterval);
      startInteractionIntervalCheck();
    };
    // Updates lastInteraction date and restarts interval
    // restartCheckInteractionInterval() has to be called, cause because the listener on the `storage` event
    // is not fired in the tab where the event happened.
    var updateLastInteraction = function() {
      restartCheckInteractionInterval();
      localStorage.setItem(lastInteractionKey, new Date().toString());
    };
    // Updates Local Storage variable that indicates if all opened tabs should log out current user.
    var logoutAllTabs = function(bool) {
      localStorage.setItem(inactivityLogoutKey, bool.toString());
    };
    // Logout with passing reason.
    var logout = function() {
      var logoutURI = URI.expand("/logout{?cause*}", {
        cause: 'timeout'
      });
      $location.url(logoutURI.toString());
    };
    // Show inactivity logout modal.
    // Before the the modal is shown the handler for checking the changes in local storage is detached.
    // After the the modal is closed or dismissed the handler will be attached again. This is because of
    // the fact that the handler is attached
    function showLogoutModal() {
      if (isLocalLogoutModalShown) {
        return false;
      }
      isLocalLogoutModalShown = true;
      modalInstance = $uibModal.open({
        templateUrl: 'views/modals/logout.html',
        controller: 'LogoutModalController',
        backdrop: true
      });
      modalInstance.result.then(function(event) {
        if (event === 'logout') {
          logoutAllTabs(true);
          logout();
        } else if (event === 'cancel') {
          // In case of multiple tabs, when the logoutModal would be canceled, the timer has to be restarted.
          updateLastInteraction();
          isLocalLogoutModalShown = false;
        }
      }, function () {
        updateLastInteraction();
        isLocalLogoutModalShown = false;
      });
    }

    // Need to check for changes in last interaction so the interval can be restarted.
    $(window).on('storage', function (event) {
      if (event.originalEvent.key === lastInteractionKey) {
        restartCheckInteractionInterval();
      } else if (event.originalEvent.key === inactivityLogoutKey && localStorage.getItem(inactivityLogoutKey) === 'true') {
        logout();
      }
    });

    // Reset 'origin-web-console-inactivity-logout' key on login.
    AuthService.onUserChanged(function() {
      logoutAllTabs(false);
    });
    updateLastInteraction();
    // Bind to click and keydown events so the in last interaction timestamp is updated.
    $(document).bind("click keydown", _.throttle(updateLastInteraction, 500));
  })
  .run(function(durationFilter, timeOnlyDurationFromTimestampsFilter, countdownToTimestampFilter) {
    // Use setInterval instead of $interval because we're directly manipulating the DOM and don't want scope.$apply overhead
    setInterval(function() {
      // Set by duration-until-now directive.
      $('.duration[data-timestamp]').text(function(i, existing) {
        var timestamp = $(this).data("timestamp");
        var omitSingle = $(this).data("omit-single");
        var precision = $(this).data("precision");
        var timeOnly  = $(this).data("time-only");
        if (timeOnly) {
          return timeOnlyDurationFromTimestampsFilter(timestamp, null) || existing;
        }
        else {
          return durationFilter(timestamp, null, omitSingle, precision) || existing;
        }
      });
      $('.countdown[data-timestamp]').text(function(i, existing) {
        var endTimestamp = $(this).data("timestamp");
        return countdownToTimestampFilter(endTimestamp);
      });
    }, 1000);
  })
  .run(function(IS_IOS) {
    if (IS_IOS) {
      // Add a class for iOS devices. This lets us disable some hover effects
      // since iOS will treat the first tap as a hover if it changes the DOM
      // content (e.g. using :before pseudo-elements).
      $('body').addClass('ios');
    }
  })
  .run(function ($rootScope, APIService) {
    $rootScope.AEROGEAR_MOBILE_ENABLED = !!APIService.apiInfo({ resource: "mobileclients", group: "mobile.k8s.io" });
    if ($rootScope.AEROGEAR_MOBILE_ENABLED) {
      // Add 'Mobile' category and sub-categories to the Service Catalog UI
      window.OPENSHIFT_CONSTANTS.SERVICE_CATALOG_CATEGORIES.push(
        {
          id: 'mobile',
          label: 'Mobile',
          subCategories: [
            {
              id: 'apps',
              label: 'Apps',
              tags: ['mobile'],
              icon: 'fa fa-mobile'
            },
            {
              id: 'services',
              label: 'Services',
              tags: ['mobile-service'],
              icon: 'fa fa-database'
            }]
        });
    }
    Logger.info("AEROGEAR_MOBILE_ENABLED: " + $rootScope.AEROGEAR_MOBILE_ENABLED);
  })
  .run(['$rootScope', 'APIService', 'KubevirtVersions',
    function ($rootScope, APIService, KubevirtVersions) {
    // Entities needs to be renamed in 3.11, https://groups.google.com/forum/#!topic/kubevirt-dev/CU_VskPIisg
    // $rootScope.KUBEVIRT_ENABLED = !!APIService.apiInfo(KubevirtVersions.offlineVirtualMachine);
  }])
    .run(['gettextCatalog', function (gettextCatalog) {
/* jshint -W100 */
  gettextCatalog.debug = true;
  gettextCatalog.setCurrentLanguage('zh_CN');
    gettextCatalog.setStrings('zh_CN', {
      "- or -": "- or -",
  "--admin=": "--admin=",
  "A cluster admin can create a project for you by running the command:": "集群管理员可以通过运行以下命令创建项目：",
  "A short description.": "简短描述。",
  "A unique name for the project.": "项目的唯一名称。",
  "Add to Project": "添加到项目",
  "An error occurred creating the application.": "创建应用时发生错误。",
  "An error occurred provisioning the service.": "提供服务时出错。",
  "An error occurred updating the service.": "更新服务时出错。",
  "Application Name": "应用名称",
  "Application name can't be more than 24 characters.": "应用程序名称不能超过24个字符。",
  "Application name consists of lower-case letters, numbers, and dashes. It must start with a letter and can't end with a": "应用程序名由小写字母、数字和破折号组成。它必须以字母开头，不能以",
  "Application name is required.": "需要应用程序名。",
  "Application name must be at least 2 characters.": "应用程序名称必须至少是2个字符。",
  "Back": "返回",
  "Browse resources for": "浏览",
  "Catalog Search": "目录搜索",
  "Clear Search Input": "清除输入",
  "Continue to the project overview": "继续项目概述",
  "Create Project": "创建项目",
  "Custom Add": "自定义添加",
  "Delete Project": "删除项目",
  "Deploy Image": "部署镜像",
  "Documentation": "文档",
  "Edit Project": "编辑项目",
  "Error": "错误",
  "Failed to update": "更新失败",
  "Get Support": "获取支持",
  "Getting Started": "开始",
  "Git Repository": "Git 仓库",
  "Git repository is required.": "需要Git仓库。",
  "Go to Project": "进入项目",
  "If you have a private Git repository or need to change application defaults, view": "如果有专用Git仓库或需要更改应用程序默认设置，请查看",
  "Image": "镜像",
  "Image Dependencies": "镜像依赖",
  "Import YAML / JSON": "导入 YAML / JSON",
  "Less": "更少",
  "More": "更多",
  "My Project": "我的项目",
  "My Projects": "我的项目",
  "Name must have at least two characters.": "名称至少包含两个字母。",
  "No Plans Available": "没有可用的计划",
  "No description provided.": "没有提供描述。",
  "Please select": "请选择",
  "Project Description": "项目描述",
  "Project Display Name": "项目显示名称",
  "Project names may only contain lower-case letters, numbers, and dashes. They may not start or end with a dash.": " 项目名称只能包含小写字母、数字和破折号。它们可能不会以破折号开始或结束。",
  "Recently Viewed": "最近查看",
  "Sample Repository:": "范例仓库。",
  "Search Catalog": "查询目录",
  "Select a Plan": "选择一个计划",
  "Service Dashboard": "服务面板",
  "Show": "展示",
  "Support": "支持",
  "Take Home Page Tour": "首页浏览",
  "The binding will be created after the service has been provisioned.": "绑定将在提供服务之后创建。",
  "The complete list of your projects could not be loaded. Type a project name to go to that project.": "无法加载项目的完整列表，键入要进入该项目的项目名称。",
  "There are no plans currently available for this service.": "目前没有这个服务的可用计划。",
  "This may take several minutes.": "这可能需要几分钟。",
  "This might not be a valid Git URL. Check that it is the correct URL to a remote Git repository.": "这可能不是有效的Git URL，请检查远程Git仓库的URL是否正确。",
  "This name is already in use. Please choose a different name.": " 此名称已在使用中。请选择不同的名称。",
  "Try Sample Repository": "尝试范例仓库",
  "Updating": "更新中",
  "Version": "版本",
  "View All": "查看所有",
  "View Documentation": "查看文档",
  "View Membership": "查看成员",
  "YourUsername": "你的用户名",
  "a project.": "一个项目",
  "advanced options": "高级选项",
  "by": "通过",
  "created": "创建",
  "Created": "创建",
  "failed to create in": "无法创建",
  "failed to provision in": "无法提供",
  "has been added to": "已添加到",
  "has been created in": "已创建到",
  "has been updated in": "已更新到",
  "in": "在",
  "is being created in": "被创建到",
  "is being provisioned in": "被提供到",
  "is being updated in": "被更新到",
  "new-project": "新建项目",
  "oc adm": "oc adm",
  "or create": "或者创建",
  "projectname": "项目名称",
  "successfully.": "成功。",
  "to bind this service to your application. Binding this service creates a secret containing the information necessary for your application to use the service.": "将此服务绑定到应用程序。绑定此服务将创建包含应用程序使用服务所需的信息的秘钥。",
  "to check the status of your application as it builds and deploys.": "检查应用程序在构建和部署时的状态。",
  "to check the status of your service.": "检查服务的状态。",
  "Cancel": "取消",
  "Confirm Login": "确认登录",
  "Confirm User Change": "确认用户改变",
  "Continue": "继续",
  "Help": "帮助",
  "Home Page Tour": "主页预览",
  "If this is unexpected, click Cancel. This could be an attempt to trick you into acting as another user.": "如果意外，请单击“取消”。这可能是试图欺骗您充当另一个用户。",
  "Log out": "退出",
  "Logging in": "登录中",
  "Logout": "退出",
  "Please wait while you are logged in": "登录中请稍候",
  "Switch Users": "切换用户",
  "Toggle navigation": "切换导航",
  "Are you sure you want to delete the project": "确定删除这个项目吗",
  "Close": "关闭",
  "Collapse": "崩溃",
  "Create": "创建",
  "Delete": "删除",
  "Delete Project {{projectName}}": "删除项目{{projectName}}",
  "Description": "描述",
  "Display Name": "显示名称",
  "Make sure this is something you really want to do!": "这将<.>删除与项目{project|displayName}}关联的所有资源</.>，并且无法撤消<.>。确保这是你真正想要做的事情！ ",
  "Name": "名称",
  "Name is required.": "名称是必须的",
  "Project names may only contain lower-case letters, numbers, and dashes.They may not start or end with a dash.": " 项目名称只能包含小写字母、数字和破折号。它们可能不会以破折号开始或结束。 ",
  "See All": "看到所有",
  "This will": "这将要",
  "Type the name of the project to confirm.": "键入要确认的项目的名称。",
  "associated with the project {{project | displayName}} and": "这将<.>删除与项目{project|displayName}}关联的所有资源</.>，并且无法撤消<.>。确保这是你真正想要做的事情！ ",
  "cannot be undone": "这将<.>删除与项目{project|displayName}}关联的所有资源</.>，并且无法撤消<.>。确保这是你真正想要做的事情！ ",
  "delete all resources": "这将<.>删除与项目{project|displayName}}关联的所有资源</.>，并且无法撤消<.>。确保这是你真正想要做的事情！ ",
  "my-project": "我的项目",
  "project to delete": "删除项目",
  "&lt;empty&gt;": "&lt;空白&gt;。",
    "– runs after the deployment strategy completes": "部署策略完成后运行 &ndash;",
    "– runs after the previous deployment is scaled down to zero and before the first pod of the new deployment is created": "在上一次部署缩小到零之后, 以及在创建新部署的第一个窗格之前, &ndash; 运行",
    "– runs before the deployment begins": "部署开始前运行 &ndash;",
    "(Build and Runtime)": "(生成和运行时)",
    "(Paused)": "(暂停)",
    "(Runtime only)": "(仅限运行时)",
    "(autoscaled)": "(自动扩展)",
    "(bare host directory volume)": "(裸主机目录卷)",
    "(cannot be changed)": "（不能更改）",
    "(disabled)": "(禁用)",
    "(latest)": "(最新)",
    "(populated by a config map)": "(由配置映射填充)",
    "(populated by a secret when the pod is created)": "(由创建窗格时的机密填充)",
    "(populated with information about the pod)": "(填充了有关容器组的信息)",
    "(pulled from git when the pod is created)": "(当容器组被创建时, 从 git 中提取)",
    "(reference to a persistent volume claim)": "（相关持久化存储卷定义）",
    "(temporary directory destroyed with the pod)": "（使用容器组销毁临时目录）",
    "(you)": "(你)",
    ", subpath {{mount.subPath}}": "，子路径{{mount.subPath}}",
    ",and {{service.spec.ports.length - 4}} others": "和{{service.spec.ports.length  -  4}}其他人",
    ",and {{service.status.loadBalancer.ingress.length - 4}} others": "和{{service.status.loadBalancer.ingress.length  -  4}}其他人",
    ",context dir: {{image.metadata.annotations.sampleContextDir}}": "，context dir：{{image.metadata.annotations.sampleContextDir}}",
    ",ref: {{image.metadata.annotations.sampleRef}}": ",ref: {{image.metadata.annotations.sampleRef}}",
    ",target port {{route.spec.port.targetPort}}": ", 目标端口 {{route.spec.port.targetPort}}",
    ". You cannot create new storage since you are at quota.": ".不能创建新存储, 因为您处于配额。",
    "/ Node Port": "/节点端口",
    "A Git repository URL is required.": "git 存储库 url 是必需的。",
    "A GitHub": "一个GitHub",
    "A Jenkinsfile is a Groovy script that defines your pipeline. In the Jenkinsfile, you can declare pipeline stages and run one or more steps within each stage. Here are some examples you can use in your pipelines.": "Jenkinsfile是一个定义管道的Groovy脚本。在Jenkinsfile中，您可以声明管道阶段并在每个阶段中运行一个或多个步骤。以下是您可以在管道中使用的一些示例。",
    "A cluster admin can create a project for you by running the command": "群集管理员可以通过运行该命令为您创建项目",
    "A command is required.": "命令是必需的。",
    "A file will be created in this directory for each key from the config map or secret. The file contents will be the value of the key.": "将在此目录中为配置映射或机密中的每个密钥创建一个文件。文件内容将是密钥的值。",
    "A liveness probe checks if the container is still running. If the liveness probe fails, the container is killed.": "活动探测器检查容器是否仍在运行。如果活动探测器失败, 容器将被杀死。",
    "A name is required.": "必须填写名称",
    "A new deployment will start automatically when": "新部署将在",
    "A persistent volume claim": "(持久化卷定义)",
    "A project is required in order to complete the installation.": "为了完成安装, 需要一个项目。",
    "A readiness probe checks if the container is ready to handle requests. A failed readiness probe means that a container should not receive any traffic from a proxy, even if it's running.": "准备情况探测器检查容器是否准备好处理请求。准备就绪探测失败意味着容器不应从代理接收任何流量，即使它正在运行。",
    "A token is a form of a password.": "令牌是密码的一种形式。",
    "A unique key for this {{type}} entry.": "此{{type}}条目的唯一键。",
    "A unique name for the horizontal pod autoscaler within the project.": "项目中水平pod自动缩放器的唯一名称。",
    "A unique name for the route within the project.": "项目名称：项目的一个独有的名称；",
    "A unique name for the storage claim within the project.": "项目中存储声明的唯一名称。",
    "A unique name for the {{type}} within the project.": "项目中 {{type} 的唯一名称。",
    "A valid name is applied to all generated resources. It is an alphanumeric (a-z, and 0-9) string with a maximum length of 24 characters, where the first character is a letter (a-z), and the '-' character is allowed anywhere except the first or last character.": "有效的名称将应用于所有生成的资源。它是一个字母数字 (a-z 和 0-9) 字符串, 最大长度为24个字符, 其中第一个字符是字母 (a-z), 除第一个或最后一个字符外, 允许在任何地方使用 \"-\" 字符。",
    "A value for replicas is required.": "副本的值是必需的。",
    "A {{trigger.data.type}} webhook trigger referencing the secret {{(trigger | getWebhookSecretData).secretReference.name}} already exists.": "引用秘密 {{{{(触发链接数据)....... 秘密. name}} 已存在。",
    "About": "关于",
    "About Compute Resources": "关于计算资源",
    "About {{aboutTitle}}": "关于{{aboutTitle}}",
    "Access Mode": "访问模式",
    "Access Modes": "访问模式",
    "Access Modes:": "访问模式：",
    "Access: {{sclass | storageClassAccessMode}}": "访问：{{sclass | storageClassAccessMode}}",
    "Account": "账户",
    "Action:": "操作：",
    "Actions": "操作",
    "Active Deadline:": "活动截止日期:",
    "Add": "添加",
    "Add ALL Values from Config Map or Secret": "添加配置地图或机密中的所有值",
    "Add Another Secret": "添加另一个秘密",
    "Add Another Service": "添加另一项服务",
    "Add Autoscaler": "添加自动缩放器",
    "Add Config Files": "添加配置文件",
    "Add Config Files to {{name}}": "将配置文件添加到{{name}}",
    "Add Health Checks": "添加健康检查",
    "Add Item": "添加条目",
    "Add Liveness Probe": "添加活探头",
    "Add Readiness Probe": "添加准备情况探头",
    "Add Storage": "添加存储",
    "Add Storage to {{name}}": "将存储添加到 {{名称}}",
    "Add Webhook": "添加Webhook",
    "Add a mobile service to your project. Or connect to external service.": "将移动服务添加到项目中。或连接到外部服务。",
    "Add an existing persistent volume claim to the template of {{kind | humanizeKind}} {{name}}.": "将现有的持久性卷声明添加到 {{亲切的种类}}} {{名称}}} 的模板中。",
    "Add argument": "添加参数",
    "Add content to your project from the catalog of web frameworks, databases, and other components. You may also deploy an existing image, create or replace resources from their YAML or JSON definitions, or select an item shared from another project.": "从 web 框架、数据库和其他组件的目录向项目添加内容。您还可以部署现有映像, 从其 yaml 或 json 定义中创建或替换资源, 或从其他项目中选择共享的项。",
    "Add only certain keys or use paths that are different than the key names.": "仅添加某些键或使用与键名称不同的路径。",
    "Add this {{ctrl.apiObject.kind | humanizeKind}} to application:": "将此 {{ctrl.apiObject.kind | humanizeKind}} 添加到应用程序:",
    "Add to Application": "添加到应用程序",
    "Add values from a config map or secret as volume. This will make the data available as files for {{kind | humanizeKind}} {{name}}.": "将配置映射或秘密中的值添加为卷。这将使数据作为 {{{亲切的种类}} {名称}} 的文件可用。",
    "Add {{ctrl.apiObject.kind | humanizeKind}} as:": "添加  {{ctrl.apiObject.kind | humanizeKind}} ",
    "Add {{type | upperFirst}} Lifecycle Hook": "添加{{type | upperFirst}}生命周期钩子",
    "Admission status unknown for router '{{ingress.routerName}}'": "路由器“{{ingress.routerName}}”的入场状态未知",
    "After downloading and installing it, you can start by logging in. You are currently logged into this console as": "下载并安装后，您可以从登录开始。您当前登录此控制台",
    "After you login to your account you will get a list of projects that you can switch between:": "登录到您的帐户后, 您将获得一个项目列表, 您可以在以下各项之间切换:",
    "Age": "寿命",
    "All content is hidden by the current filter.": "当前筛选器隐藏所有内容。",
    "All events hidden by filter.": "过滤器隐藏的所有事件。",
    "All pipelines are filtered.": "对所有管道进行筛选。",
    "Allow": "允许",
    "Alternate Services": "备用服务",
    "Alternate service for route traffic.": "路由流量的备用服务。",
    "Always pull the builder image from the docker registry, even if it is present locally": "始终从docker镜像仓库提取生成器映像, 即使它在本地存在",
    "Amount": "金额",
    "An error occurred deleting the binding.": "删除绑定时出错。",
    "An error occurred getting metrics": "获取指标时出错",
    "An error occurred loading the log.": "加载日志时出错。",
    "An error occurred starting the debug pod.": "启动调试容器组时出错。",
    "An image that can carry out the deployment.": "可以执行部署的映像。",
    "Application": "应用",
    "Application Console": "应用控制台",
    "Applied Parameter Values": "应用的参数值",
    "Are you sure you want to delete the {{typeDisplayName || (kind | humanizeKind)}}": "确实要删除{{typeDisplayName || (kind | humanizeKind)}}",
    "Are you sure you want to scale": "确实要扩展",
    "Args:": "参数:",
    "Arguments": "参数",
    "Authentication Type": "身份验证类型",
    "Autodeploy when": "自动部署时",
    "Automatically build a new image when the builder image changes": "生成器映像更改时自动生成新映像",
    "Automatically start a new deployment when the image changes": "当映像更改时自动启动新部署",
    "Autoscale {{targetKind | humanizeKind : true}} {{targetName}}": "自动扩展 {{targetKind | humanizeKind : true}} {{targetName}}",
    "Autoscaled:": "自动扩展",
    "Autoscaling": "自动扩展中",
    "Autoscaling is not enabled. There are no autoscalers for this": "未启用自动缩放。没有自动扩展功能",
    "Autoscaling is not enabled. There are no autoscalers for this deployment config.": "未启用自动扩展。此部署配置没有自动扩展器。",
    "Available of": "可用",
    "Average Duration:": "平均持续时间:",
    "Average Usage": "平均使用数",
    "Average build duration {{averageDurationText}}": "平均生成持续时间  {{averageDurationText}}",
    "Average per pod": "每个容器组的平均数",
    "Average: {{averageDurationText}}": "平均数: {{averageDurationText}}",
    "Back to catalog": "返回目录",
    "Back to overview": "回到概述",
    "Back to {{kind | humanizeKind}} {{name}}": "返回 {{kind | humanizeKind}} {{name}}",
    "Basic CLI Operations": "基本命令行操作",
    "Binary Input as File:": "作为文件的二进制输入:",
    "Binary Units": "二进制单元",
    "Binding for the following has been deleted:": "已删除以下绑定：",
    "Bindings": "绑定",
    "Bitbucket Webhook URL:": "Bitbucket Webhook URL地址:",
    "Browse": "浏览",
    "Browse Catalog": "浏览目录",
    "Browse Mobile Services": "浏览移动服务",
    "Build": "构建",
    "Build #{{build | annotation : 'buildNumber'}}": "生成 #{{build | annotation : '生成编号'}}",
    "Build From": "从构建",
    "Build Secret": "构建秘钥",
    "Build Secrets": "构建秘钥",
    "Build Strategy:": "构建策略:",
    "Build config": "构建配置",
    "Build config {{buildConfig.metadata.name}}": "构建 #{{build | annotation : '构建编号'}}",
    "Build hooks allow you to run commands at the end of the build to verify the image.": "生成挂钩允许您在生成结束时运行命令以验证映像。",
    "Build:": "构建：",
    "Builder Image:": "构建镜像",
    "Builds": "构建",
    "Builds source code": "构建源代码",
    "Builds triggered from this Build Configuration will run all at the same time. The order in which they will finish is not guaranteed.": "从此构建配置触发的构建将同时运行。他们将完成的顺序无法保证。",
    "Builds triggered from this Build Configuration will run one at the time, in the order they have been triggered.": "从此构建配置触发的生成将在触发的顺序运行一个。",
    "Builds triggered from this Build Configuration will run one at the time. When a currently running build completes, the next build that will run is the latest build created. Other queued builds will be cancelled.": "从此构建配置触发的生成将在该时间运行一个。当前正在运行的生成完成后, 将运行的下一个生成是创建的最新生成。其他排队的生成将被取消。",
    "Builds triggered from this Build Configuration will run using the {{updatedBuildConfig.spec.runPolicy | sentenceCase}} policy.": "从此构建配置触发的生成将使用 {{{{updatedBuildConfig.spec.runPolicy sentencercase}} 策略运行。",
    "Builds will create an image from": "构建将创建一个镜像",
    "CA Certificate": "CA 证书",
    "CA Certificate File": "CA证书文件",
    "CA Certificate:": "CA 证书( C) ：",
    "CLI Reference": "CLI参考",
    "CPU Request": "cpu 请求",
    "CPU Request Target": "cpu 请求目标",
    "CPU and": "cpu 和",
    "CPU is often measured in units called": "cpu 通常以称为",
    "CPU metrics might not be available. In order to use horizontal pod autoscalers, your cluster administrator must have properly configured cluster metrics.": "cpu 指标可能不可用。为了使用水平容器组自动扩展, 群集管理员必须正确配置群集指标。",
    "Can't be greater than {{limitRangeMax | usageWithUnits : type}}.": "不能大于 {{limitRangeMax | usageWithUnits : type}}。",
    "Can't be greater than {{limits.max | usageWithUnits : 'storage'}}.": "不能大于 {{limits.max | usageWithUnits : '存储'}}.",
    "Can't be less than {{limitRangeMin | usageWithUnits : type}}.": "不能小于 {{limitRangeMin | usageWithUnits : type}}。",
    "Can't be less than {{limits.min | usageWithUnits : 'storage'}}.": "不能小于 {{limits.min | usageWithUnits : 'storage'}}。",
    "Can't be longer than {{hostnameMaxLength}} characters.": "不能超过{{hostnameMaxLength}}个字符。",
    "Can't be longer than {{nameValidation.maxlength}} characters.": "不能超过{{nameValidation.maxlength}}个字符。",
    "Can't be negative.": "不能是阴性的",
    "Cancel Build": "取消构建",
    "Capacity": "容量",
    "Capacity:": "容量：",
    "Catalog Home (Default)": "目录主页 (默认值)",
    "Certificate": "证书",
    "Certificate:": "证书:",
    "Certificates": "证书",
    "Change Of:": "改变:",
    "Changes will only apply to new pods.": "更改仅适用于新容器组。",
    "Check events": "检查事件",
    "Checkout source code and run shell commands on a node labelled": "签出源代码并在标记为标签的节点上运行 shell 命令",
    "Choose Existing Project": "添加到项目",
    "Choose a Project": "选择项目",
    "Choose from web frameworks, databases, and other components to add content to your project.": "从Web框架，数据库和其他组件中进行选择，以向项目添加内容。",
    "Claim name:": "定义名称:",
    "Clear All Filters": "当前筛选器隐藏所有内容。",
    "Clear Changes": "取消更改",
    "Clear Value": "清除数值",
    "Clear notification": "清除通知",
    "Clear {{ (type || 'Command') | upperFirst }}": "清除{{ (type || 'Command') | upperFirst }}",
    "Cluster": "集群",
    "Cluster Console": "集群控制台",
    "Cluster IP": "集群IP",
    "Collapse event sidebar": "崩溃事件边栏",
    "Collapse to a single line input": "崩溃到单行输入",
    "Command": "命令",
    "Command Line Tools": "命令行工具",
    "Command:": "命令：",
    "Compute Resources": "计算资源",
    "Config": "配置",
    "Config Change For:": "配置更改为:",
    "Config Map/Secret": "配置映射/秘钥",
    "Config Map:": "配置映射:",
    "Config Maps": "配置映射",
    "Config change": "配置更改",
    "Config map {[configMap.metadata.name}} has been deleted since you started editing it.": "自开始编辑配置映射 {[configMap.metadata.name}} 以来, 该地图已被删除。",
    "Config map {{configMap.metadata.name}} has changed since you started editing it.": "自您开始编辑后，配置映射{{configMap.metadata.name}}已更改。",
    "Config maps hold key-value pairs that can be used in pods to read application configuration.": "配置映射包含可在容器组中使用的键值对，以读取应用程序配置。",
    "Config maps hold key-value pairs that can be used in pods to read applicationconfiguration.": "配置映射保存可在容器组中用于读取应用程序配置的键值对。",
    "Configuration": "配置",
    "Configuration File": "配置文件",
    "Configuration file should be in JSON format.": "配置文件应采用 json 格式。",
    "Configure a webhook build trigger": "配置网络挂钩生成触发器",
    "Confirm Delete": "确认删除",
    "Confirm Replace": "确认替换",
    "Confirm Save": "确认保存",
    "Confirm Scale Down": "确认向下扩展",
    "Container Metrics": "容器指标",
    "Container Name": "容器名称",
    "Container Restarts": "容器重新启动",
    "Container health is periodically checked using readiness and liveness probes.": "使用准备和活动探头定期检查容器的运行状况。",
    "Container {{container.name}}": "容器  {{container.name}}",
    "Container {{containerName}}": "容器 {{containerName}}",
    "Container {{containerStatus.name}}": "容器  {{containerStatus.name}}",
    "Container {{podTemplate.spec.containers[0].name}} does not have health checks": "容器 {{podTemplate.spec.containers[0].name}} 没有运行状况检查",
    "Container {{strategyParams[type].execNewPod.containerName}}": "容器 {{strategyParams[type].execNewPod.containerName}}",
    "Container {{tagImage.containerName}}": "容器{{tagImage.containerName}}",
    "Container:": "容器:",
    "Containers": "容器",
    "Containers Ready": "容器准备好了",
    "Containers:": "容器：",
    "Content type": "内容类型",
    "Context Dir": "上下文目录",
    "Continue Session": "继续会话",
    "Copy to Clipboard": "复制到剪贴板",
    "Could not find any images for {{import.name | stripTag}}:{{import.tag}}.": "找不到任何关于{{import.name | stripTag}}:{{import.tag}}的镜像。",
    "Could not load image metadata.": "无法加载镜像元数据。",
    "Could not start container {{container.name}}.": "无法启动容器 {{container.name}}。",
    "Create Binding": "创建绑定",
    "Create Config Map": "创建配置映射",
    "Create New Secret": "创建新的秘钥",
    "Create New Webhook Secret": "创建新的webhook秘钥",
    "Create Route": "创建路由",
    "Create Sample Pipeline": "创建样本管道",
    "Create Secret": "创建秘钥",
    "Create Storage": "创建存储",
    "Create a New Project": "创建新项目",
    "Create a project for your application.": "为您的应用程序创建一个项目。",
    "Create a request for an administrator-defined storage asset by specifying size and permissions for a best fit.": "通过指定最适合的大小和权限，创建对管理员定义的存储资产的请求。",
    "Create or replace resources from their YAML or JSON definitions. If adding a template, you'll have the option to process the template.": "从YAML或JSON定义创建或替换资源。如果添加模板，您可以选择处理模板。",
    "Create route": "创建路由",
    "Create the objects defined in the template. You will have an opportunity to fill in template parameters.": "创建模板中定义的对象。您将有机会填写模板参数。",
    "Create {{type | capitalize}} Secret": "创建 {{type | capitalize}} 秘钥",
    "Credentials Store": "证书商店",
    "Current Usage:": "目前的用法：",
    "Custom certificates cannot be used with passthrough termination.": "自定义证书不能用于通过终止。",
    "Daemon Sets": "守护程序集",
    "Dashboard": "管理面板",
    "Debug Container {{container.name}}": "调试容器 {{container.name}}",
    "Debug in Terminal": "在终端调试",
    "Debugging pod {{pod | debugPodSourceName}}": "调试容器组  {{pod | debugPodSourceName}}",
    "Decimal Units": "十进制单位",
    "Default": "默认",
    "Delay can't be negative.": "延迟不能为负数。",
    "Delete Binding": "删除绑定",
    "Delete This Service": "删除此服务",
    "Delete pod immediately without waiting for the processes to terminate gracefully": "立即删除窗格, 而无需等待进程正常终止",
    "Delete row": "删除行",
    "Delete {{kind | humanizeKind}} {{resourceName}}": "删除  {{kind | humanizeKind}} {{resourceName}}",
    "Deletion of Binding Failed": "删除绑定失败",
    "Deploy": "部署",
    "Deploy an existing image from an image stream tag or image registry.": "从镜像流标记或镜像注册表部署现有镜像。",
    "Deployment": "部署",
    "Deployment Config:": "部署配置:",
    "Deployment Configs": "部署配置",
    "Deployment Strategy": "部署战略",
    "Deployment configuration changes": "部署配置更改",
    "Deployment:": "部署",
    "Deployments": "部署",
    "Desired storage capacity.": "所需的存储容量。",
    "Destination CA Cert:": "目的地 ca 证书:",
    "Destination CA Certificate": "目标 ca 证书",
    "Destination Directory": "目标目录",
    "Details": "说明",
    "Directory where the files will be available at build time.": "文件在生成时可用的目录。",
    "Dismiss": "清除",
    "Do not share your API token. To reveal your token, press the copy to clipboard button and then paste the clipboard contents.": "不要共享您的API令牌。要显示您的令牌，请按复制到剪贴板按钮，然后粘贴剪贴板内容。",
    "Do you want to replace the existing resources?": "您想替换现有资源吗？",
    "Do you want to replace with the new content?": "是否要替换为新内容？",
    "Docker Image Repository": "docker 镜像仓库",
    "Docker Repo": "Docker Repo",
    "Dockerfile": "Dockerfile",
    "Dockerfile Path": "Dockerfile 路径",
    "Dockerfile:": "Dockerfile:",
    "Done Editing": "编辑完成",
    "Download": "下载",
    "Drop file here": "删除文件",
    "Duplicate key \"{{item.key}}\". Keys must be unique within the {{type}}.": "重复的键 \"{item.key}}\"。键在 {{type} 中必须是唯一的。",
    "Duration": "持续时间",
    "Duration:": "持续时间：",
    "Each container running on a node uses compute resources like CPU and memory. You can specify how much CPU and memory a container needs to improve scheduling and performance.": "在节点上运行的每个容器都使用CPU和内存等计算资源。您可以指定容器需要多少CPU和内存来改善调度和性能。",
    "Each millicore is equivalent to": "每个millicore相当于",
    "Edit": "编辑",
    "Edit Autoscaler": "添加自动扩展器",
    "Edit Build Config {{buildConfig.metadata.name}}": "编辑构建配置 {buildConfig.metadata.name}}",
    "Edit Config Map {{configMap.metadata.name}}": "编辑配置映射 {configMap.metadata.name}}",
    "Edit Configuration": "编辑配置",
    "Edit Deployment Config {{deploymentConfig.metadata.name}}": "编辑部署配置 {deploymentConfig.metadata.name}}",
    "Edit Health Checks": "编辑健康检查",
    "Edit Membership": "编辑会员",
    "Edit Parameters": "编辑参数",
    "Edit Pipeline": "编辑管道",
    "Edit Project {{project.metadata.name}}": "编辑项目 {{project.metadata.name}}",
    "Edit Resource": "编辑资源",
    "Edit Resource Limits": "编辑资源限制",
    "Edit Route {{routeName}}": "编辑路由{{routeName}}",
    "Edit Weights Using Percentage Slider": "使用百分比滑块编辑权重",
    "Edit YAML": "编辑 yaml",
    "Email": "邮箱",
    "Email is required.": "邮箱必需",
    "Email must be in the form of": "电子邮件必须以",
    "End of log": "日志结束",
    "Enter the command to run inside the container. The command is considered successful if its exit code is 0. Drag and drop to reorder arguments.": "输入要在容器内运行的命令。如果退出代码为0，则该命令被视为成功。拖放以重新排序参数。",
    "Environment": "环境",
    "Environment From": "环境来自",
    "Environment Variables": "环境变量",
    "Environment Variables:": "环境变量:",
    "Environment variables": "环境变量",
    "Environment variables can be edited on deployment config": "可以在部署配置时编辑环境变量",
    "Environment variables can be edited on the": "可以在上面编辑环境变量",
    "Environment variables can be edited on the deployment": "可以在部署中编辑环境变量",
    "Environment variables to supply to the hook pod's container.": "要提供给挂接容器的环境变量。",
    "Errors": "错误",
    "Events": "事件",
    "Execute docker build without reusing cached instructions.": "在不重复使用缓存指令的情况下执行docke构建。",
    "Exit code: {{containerState.terminated.exitCode}}": "退出代码: {{containerState.terminated.exitCode}}",
    "Expand": "展开",
    "Expand Persistent Volume Claim": "展开持久卷声明",
    "Expand event sidebar": "展开事件边栏",
    "Expand to enter multiline input": "展开以输入多行输入",
    "Exposed on router '{{ingress.routerName}}'": "在路由器上扩展  '{{ingress.routerName}}'",
    "External Hostname:": "扩展主机名：",
    "External IP": "外部IP",
    "External IPs:": "外部 IP:",
    "Fail the deployment if the hook fails.": "如果挂钩失败，则部署失败。",
    "Failed to process the resource.": "无法处理资源。",
    "Failure Policy": "失败策略",
    "Failure Policy:": "失败策略：",
    "File with credentials and other configuration for connecting to a secured image registry.": "具有凭据和其他配置的文件，用于连接到安全映像注册表。",
    "Filter": "过滤",
    "Filter by keyword": "按关键字过滤",
    "Filter by keyword or change sort options to see other projects.": "按关键字过滤或更改排序选项以查看其他项目。",
    "Filter by labels": "按标签过滤",
    "Filter by name": "按名称过滤",
    "Filter by name or description": "按名称或说明过滤",
    "Find": "查找",
    "Follow": "跟随",
    "For other information about the command line tools, check the": "有关命令行工具的其他信息，请查看",
    "Generate": "生成",
    "Generic Webhook URL:": "通用Webhook URL：",
    "Get Started with the CLI": "开始使用CLI",
    "Get started with your project.": "开始使用您的项目。",
    "Git Configuration File": "Git配置文件",
    "Git Reference": "Git参考",
    "Git Repository URL": "Git仓库URL",
    "Git URL of the source code to build.": "Git要构建的源代码的URL。",
    "GitHub Webhook URL:": "GitHub Webhook URL:",
    "GitLab Webhook URL:": "GitHub Webhook URL:",
    "Go to End": "转到最后",
    "Go to Top": "返回顶部",
    "Grace Period:": "限期:",
    "Group service to {{service.metadata.name}}": "将服务分组到{{service.metadata.name}}",
    "Health Checks: {{name}}": "健康检查：{{name}}",
    "Hide": "隐藏",
    "Hide Advanced Image Options": "高级映像选项",
    "Hide Advanced Strategy Options": "隐藏高级策略选项",
    "Hide Image Environment Variables": "隐藏映像环境变量",
    "Hide examples": "隐藏示例",
    "Hide older resources": "隐藏旧资源",
    "History": "历史",
    "Hook Types": "钩子类型",
    "Hooks": "钩子",
    "Horizontal Pod Autoscaler": "容器组水平自动扩展",
    "Hostname": "主机名",
    "Hostname must consist of lower-case letters, numbers, periods, and  hyphens. It must start and end with a letter or number.": "主机名必须由小写字母，数字，句点和连字符组成。它必须以字母或数字开头和结尾。",
    "Hostname:": "主机名:",
    "How long to wait after the container starts before checking its health.": "在检查其运行状况之前，容器启动后需要等待多长时间。",
    "How long to wait for a pod to scale up before giving up.": "在放弃之前等待容器组扩展多长时间。",
    "How long to wait for the probe to finish. If the time is exceeded, the probe is considered failed.": "等待探头完成多长时间。如果超过时间，则认为探测失败。",
    "Identifies the resources created for this application.": "标识为此应用程序创建的资源。",
    "Identifies the resources created for this image.": "标识为此映像创建的资源。",
    "Idle": "空闲",
    "Idled due to inactivity.": "由于不活动而空闲。",
    "If another storage class is not chosen, the default storage class": "如果未选择另一个存储类, 则默认存储类",
    "If not specified, a hostname is generated.": "如果未指定, 则生成主机名。",
    "If this isn't what you want,": "如果这不是你想要的，",
    "If unchecked, a new rollout will start on save.": "如果未选中，则会在保存时启动新的卷展栏。",
    "If you do not have any existing projects, you can create one:": "如果您没有任何现有项目，可以创建一个：",
    "If you need to create resources in this project, a project administrator can grant you additional access by running this command:": "如果需要在此项目中创建资源，项目管理员可以通过运行此命令为您授予其他访问权限：",
    "If you want to log into the CLI using the same session token:": "如果要使用相同的会话令牌登录CLI：",
    "If your Git repository is private, view the": "如果您的Git仓库是私有的，请查看",
    "Ignore hook failures and continue the deployment.": "忽略钩子故障并继续部署。",
    "Image Configuration": "映像配置",
    "Image Name": "映像名称",
    "Image Registry Server Address": "映像仓库服务器地址",
    "Image Source From": "映像来源于",
    "Image Sources:": "映像资源：",
    "Image Stream": "映像流",
    "Image Stream Image": "映像流映像",
    "Image Stream Tag": "映像流标签",
    "Image Streams": "映像流",
    "Image change": "映像改变",
    "Image name or pull spec": "映像名称或拉动规格",
    "Image registry server address is required.": "映像注册服务器地址是必需的。",
    "Image search is only available for existing projects.": "映像搜索仅适用于现有项目。",
    "Image value set": "映像值设定",
    "Image:": "映像：",
    "Images": "映像",
    "Increase the capacity of claim": "增加定义容量",
    "Ingress Points:": "入口点:",
    "Init Containers": "初始化",
    "Init container {{containerStatus.name}}": "初始化容器{{containerStatus.name}}",
    "Initial Delay": "初始化延迟",
    "Input Required": "输入必需",
    "Insecure Traffic": "不安全的流量",
    "Insecure Traffic:": "不安全流量",
    "Instance Name": "实例名称",
    "Interval": "间隔",
    "Interval can't be negative.": "间隔不能是负面的。",
    "Interval:": "时间间隔：",
    "It cannot be undone. Make sure this is something you really want to do!": "它无法撤消。确保这是你真正想做的事情！",
    "Jenkins Pipeline Configuration": "Jenkins管道配置",
    "Jenkinsfile": "Jenkinsfile",
    "Jenkinsfile Examples": "Jenkinsfile 示例",
    "Jenkinsfile Path:": "Jenkinsfile路径：",
    "Jenkinsfile Source Path": "Jenkinsfile源路径",
    "Jenkinsfile Type": "Jenkinsfile类型",
    "Jenkinsfile:": "Jenkinsfile：",
    "Key": "关键值",
    "Key is required.": "关键值是必须的",
    "Key to File:": "文件关键值",
    "Key:": "关键值：",
    "Keys and Paths": "关键值和路径",
    "Keys may not be longer than 253 characters.": "关键值长度不得超过253个字符。",
    "Keys may only consist of letters, numbers, periods, hyphens, and underscores.": "关键值可能只包含字母，数字，句点，连字符和下划线。",
    "Kind": "类",
    "Kind and Name": "类和名称",
    "Kubernetes Master:": "Kubernetes管理端：",
    "Labels": "标签",
    "Last 15 Minutes": "最后15分钟",
    "Last Build": "最后一次构建",
    "Last Scaled:": "最后扩展:",
    "Last State": "最后状态",
    "Last Version": "最后版本",
    "Launch the first build when the build configuration is created": "在创建构建配置时启动第一个构建",
    "Layers": "层",
    "Learn More": "学到更多",
    "Learn more about": "学习更多关于",
    "Learn more about the": "学习更多关于",
    "Lifecycle Action": "生命周期行动",
    "Limit": "限制",
    "Limit Range": "限制范围",
    "Limit can't be less than request ({{request | usageWithUnits : type}}).": "限制不能小于请求（{{request | usageWithUnits：type}}）。",
    "Limit cannot be more than {{maxLimitRequestRatio}} times request value. (Request: {{request | usageWithUnits : type}},Limit: {{(input.amount ? (input.amount + input.unit) : defaultValue) | usageWithUnits : type}})": "限制不能超过 {{maxLimitRequestRatio}} times request value. (Request: {{request | usageWithUnits : type}},Limit: {{(input.amount ? (input.amount + input.unit) : defaultValue) | usageWithUnits : type}})",
    "Limit is required if request is set. (Max Limit/Request Ratio: {{maxLimitRequestRatio}})": "如果设置了请求，则需要限制。 (Max Limit/Request Ratio: {{maxLimitRequestRatio}})",
    "Limits": "限制",
    "Limits resource usage across a set of projects.": "限制一组项目的资源使用。",
    "Link secret to a service account.": "将密钥链接到服务帐户。",
    "List by": "列表排序按",
    "List of named volumes to copy to the hook pod.": "要复制到挂钩资源组的命名卷的列表。",
    "Liveness Probe": "活探测",
    "Liveness Probe:": "活探测:",
    "Loading image metadata for": "加载映像元数据",
    "Loading...": "加载中...",
    "Log Out": "登出",
    "Log from": "从登录",
    "Log from {{build.status.startTimestamp  | date : 'medium'}}": "从 {{build.status.startTimestamp  | date : 'medium'}}登陆",
    "Logs": "日志",
    "Logs are not available for replica sets.": "日志不适用于副本集。",
    "Logs are not available for stateful sets.": "日志不适用于有状态集。",
    "Logs are not available.": "日志不可用。",
    "Making code changes": "进行代码更改",
    "Manual (CLI):": "手动（CLI）：",
    "Manual build": "手动构建",
    "Mark Read": "设为已读",
    "Marked for Deletion": "标记为删除",
    "Max": "最大值",
    "Max Limit/Request": "最大限制/请求",
    "Max Pods": "最大容器组数：",
    "Max Pods:": "最大容器组数",
    "Max Surge:": "最大峰值：",
    "Max Unavailable:": "最大不可用：",
    "Max pods is a required field.": "最大容器组数是必填字段。",
    "Max pods must be a number.": "最大容器组数必须是一个数字。",
    "Max pods must be greater than or equal to": "最大容器组数必须大于或等于",
    "Max: {{limits.max | usageWithUnits : 'storage'}}": "最大值：{{limits.max | usageWithUnits : '存储'}}",
    "Max: {{limits.max | usageWithUnits : type}}": "最大值：{{limits.max | usageWithUnits：type}}",
    "Maximum Number of Surge Pods": "蜂拥容器组最大数目",
    "Maximum Number of Unavailable Pods": "不可用的最大容器组数",
    "Medium:": "介质",
    "Membership": "成员",
    "Memory": "内存",
    "Memory and Storage": "内存和存储",
    "Memory:": "内 存：",
    "Message": "消息",
    "Message Unread.": "消息未读。",
    "Message:": "信息：",
    "Messages": "信息",
    "Metrics": "指标",
    "Metrics are not available.": "指标不可用。",
    "Metrics might not be configured by your cluster administrator. Metrics are required for autoscaling.": "您的群集管理员可能未配置度量标准。自动扩展需要度量标准。",
    "MiB": "MiB",
    "Mid Lifecycle Hook": "中期生命周期钩",
    "Mid hooks execute after the previous deployment is scaled down to zero and before the first pod of the new deployment is created.": "在先前部署缩小到零之后并且在创建新部署的第一个容器组之前执行中间挂钩。",
    "Min": "最小值",
    "Min Pods": "最小容器组数",
    "Min Pods:": "最小容器组数:",
    "Min Ready:": "最小准备：",
    "Min pods must be a number.": "最小容器组数必须是一个数字。",
    "Min pods must be a whole number.": "最小容器组数必须是一个整数。",
    "Min pods must be greater than or equal to 1.": "最小容器组数必须大于或等于",
    "Min: {{limits.min | usageWithUnits : 'storage'}}": "最小值： {{limits.min | usageWithUnits : '存储'}}",
    "Min: {{limits.min | usageWithUnits : type}}": "最小值：{{limits.min | usageWithUnits：type}}",
    "Minimum character count is {{keyMinlength}}": "最小字符数为{{keyMinlength}}",
    "Minimum character count is {{valueMinlength}}": "最小字符数为{{valueMinlength}}",
    "Mobile Clients": "移动客户端",
    "Mode:": "模式:",
    "More labels...": "更多标签......",
    "More than one image tag is defined. To change image tags, use the YAML editor.": "定义了多个映像标签。要更改映像标签，请使用YAML编辑器。",
    "Mount Path": "挂载路径",
    "Mount Path for the volume. A file will be created in this directory for each key from the {{ctrl.apiObject.kind | humanizeKind}}.The file contents will be the value of the key.": "卷的挂载路径。将在此目录中为 {{ctrl.apiObject.kind | humanizeKind}}。文件内容将是密钥的值。",
    "Mount path": "挂载路径",
    "Mount path for the volume inside the container. If not specified, the volume will not be mounted automatically.": "容器内容积的安装路径。如果未指定，则不会自动装入卷。",
    "Mount path for the volume.": "卷的挂载路径。",
    "Mount path must be a valid path to a directory starting with": "挂载路径必须是一个有效地址，路径开始必须以",
    "Mount the volume as read-only.": "挂载卷设置为已读",
    "Mount:": "挂载:",
    "Move row": "移动行",
    "Must be a non-negative whole number or percentage.": "必须是非负整数或百分比。",
    "Must be a number.": "必须是数字",
    "Must be a positive number.": "必须是正数。",
    "Must be a whole number greater than or equal to 0.": "必须是大于或等于0的整数。",
    "Must be a whole number.": "必须是一个整数。",
    "My Projects List": "我的项目列表",
    "Name can't have more than 24 characters.": "名称不能超过24个字符。",
    "Name must be an alphanumeric (a-z, 0-9) string with a maximum length of 24 characters where the first character is a letter (a-z). The '-' character is allowed anywhere except the first or last character.": "名称必须是字母数字（az，0-9）字符串，最大长度为24个字符，其中第一个字符是字母（az）。除第一个或最后一个字符外，允许使用“ - ”字符。",
    "Name must have at least 2 characters.": "名称必须至少包含2个字符。",
    "Names will be prefixed with": "名称前缀必须以",
    "Namespace": "命名空间",
    "Namespace: {{ resource.metadata.namespace }}": "命名空间: {{resource.metadata.namespace}}",
    "Namespace: {{imageStream.metadata.namespace}}": "命名空间: {{imageStream.metadata.namespace}}",
    "Namespace: {{template.metadata.namespace}}": "命名空间: {{template.metadata.namespace}}",
    "Networking": "网络设置",
    "New Image For:": "新的映像：",
    "New image is available": "新映像可用",
    "Next": "下一页",
    "No": "没有",
    "No Routes": "没有路由",
    "No Traffic": "无流量",
    "No bindings": "无绑定",
    "No builds": "无构建",
    "No builds have been added to project {{projectName}}.": "尚未将构建添加到项目 {{项目名称}}}。",
    "No builds.": "无构建",
    "No config maps have been added to project {{projectName}}.": "没有为项目{{projectName}}添加配置映射。",
    "No config maps or secrets have been added as Environment From.": "没有配置映像或秘钥被添加为环境",
    "No config maps or secrets.": "没有配置映射或秘钥。",
    "No config maps.": "没有配置映射。",
    "No data.": "暂无数据",
    "No deployments": "暂无部署",
    "No deployments for": "没有部署",
    "No deployments have been added to project {{projectName}}.": "没有为项目{{projectName}}添加任何部署。",
    "No deployments.": "暂无部署",
    "No environment variables set in the {{$ctrl.apiObject.kind | humanizeKind}} template for container {{container.name}}.": "没有环境变量被设置在容器 {{container.name}}的 {{$ctrl.apiObject.kind | humanizeKind}}模板",
    "No events to show.": "没有要显示的事件。",
    "No events.": "没有事件。",
    "No image metadata found.": "找不到映像元数据。",
    "No image streams have been added to project {{projectName}}.": "项目{{projectName}}中没有添加任何映像流。",
    "No image streams.": "暂无映像流",
    "No images or templates are loaded for the category {{category.label}}.": "没有为类别{{category.label}}加载映像或模板。",
    "No images or templates are loaded for this project or the shared": "没有为此项目或共享加载映像或模板",
    "No images or templates.": "没有图像或模板。",
    "No layer information is available for this image.": "此映像没有可用的图层信息。",
    "No metrics to display.": "没有要显示的指标。",
    "No persistent volume claims have been added to project {{projectName}}.": "项目{{projectName}}中未添加持久性卷定义。",
    "No persistent volume claims.": "没有持久化卷定义",
    "No pipeline builds have run for {{buildConfigName}}.": "没有为{{buildConfigName}}运行管道构建。",
    "No pipeline runs.": "没有管道运行。",
    "No pipelines have been added to project {{projectName}}.": "项目{{projectName}}中没有添加任何管道。",
    "No pipelines.": "没有管道。",
    "No pods have been added to project {{projectName}}.": "还没有将容器组添加到项目{{projectName}}。",
    "No pods.": "暂无容器组",
    "No provisioned services have been added to project {{projectName}}.": "没有为项目{{projectName}}添加配置服务。",
    "No provisioned services.": "没有预配的服务。",
    "No routes have been added to project {{projectName}}.": "没有为项目{{projectName}}添加路由。",
    "No routes or ports to show": "没有要显示的路由和端口",
    "No routes.": "暂无路由",
    "No running containers": "没有运行容器",
    "No secrets have been added to project {{projectName}}.": "项目{{projectName}}没有添加任何秘钥。",
    "No secrets.": "没有秘钥。",
    "No services have been added to project {{projectName}}.": "没有为项目{{projectName}}添加任何服务。",
    "No services.": "暂无服务",
    "No source inputs have been defined for this build configuration.": "没有为此构建配置定义源输入。",
    "No stages have started.": "目前还没有开始任何阶段。",
    "No stateful sets have been added to project {{projectName}}.": "项目{{projectName}}中没有添加任何有状态集。",
    "No stateful sets.": "暂无状态集。",
    "No username and password.": "没有用户名和密码",
    "No value": "没有值",
    "No {{resourceName}} have been added to project {{projectName}}.": "项目{{projectName}}中未添加{{resourceName}}。",
    "No {{resourceName}}.": "没有{{resourceName}}。",
    "No {{type || 'command'}} set.": " {{type || '命令行'}} 未设定",
    "Node:": "节点：",
    "None": "无",
    "Normal": "正常",
    "Not all containers have health checks": "并非所有容器都有健康检查",
    "Not available": "没有可用的",
    "Note that this will start a new build.": "注意： 将启动新构建。",
    "Note: This setting is browser-specific and will not be maintained across browsers.": "注意: 此设置是特定于浏览器的, 不会跨浏览器维护。",
    "Notifications": "通知",
    "Only the first {{limitListTo}} projects are displayed.": "仅显示第一个{{limitListTo}}项目。",
    "Only the previous {{options.tailLines || 5000}} log lines and new log messages will be displayed because of the large log size.": "只有前面的{{options.tailLines || 5000}} 日志行和新日志消息。",
    "Open Fullscreen Terminal": "打开全屏终端",
    "Open socket on port {{probe.tcpSocket.port}}": "在端口{{probe.tcpSocket.port}}上打开套接字",
    "OpenShift": "NeokylinKube",
    "OpenShift Master:": "openshift管理端：",
    "OpenShift Pipeline Plugin": "openshift管道插件",
    "OpenShift Web Console:": "openshift web控制台",
    "OpenShift helps you quickly develop, host, and scale applications.": "OpenShift可帮助您快速开发，托管和扩展应用程序。",
    "Operating System:": "操作系统",
    "Optional branch, tag, or commit.": "可选的分支，标记或提交。",
    "Optional path to the Jenkinsfile relative to the context dir. Defaults to the Jenkinsfile in context dir.": "相对于上下文目录的Jenkinsfile的可选路径。默认为上下文目录中的Jenkinsfile。",
    "Optional path within the volume from which it will be mounted into the container. Defaults to the volume's root.": "卷中的可选路径，将从该路径安装到容器中。默认为卷的根。",
    "Optional subdirectory for the application source code, used as the context directory for the build.": "应用程序源代码的可选子目录，用作构建的上下文目录。",
    "Optional username for Git authentication.": "Git 身份验证的可选用户名。",
    "Optionally, you can specify a prefix to use with environment variables.": "（可选）您可以指定用于环境变量的前缀。",
    "Original Command:": "原始命令：",
    "Other Replication Controllers": "其他副本控制器",
    "Other Resources": "其他资源",
    "Other Trigger:": "其他触发器：",
    "Other {{parentCategory.label}}": "其他{{parentCategory.label}}",
    "Output Image:": "输出映像：",
    "Output To:": "输出到：",
    "Over limit of": "超限",
    "Overview Page for{{availableProjects.length === 1 ? ' ' + (selectedProject | displayName) : ':'}}": "概述页 {{availableProjects.length === 1 ? ' ' + (selectedProject | displayName) : ':'}}",
    "Parameter {{$ctrl.parameters.generated[0]}} was generated automatically.": "参数 {{$ctrl. parameters.generated[0]}} 是自动生成的。",
    "Parameters": "参数",
    "Passthrough routes can't use the insecure traffic policy": "直通路由不能使用不安全的流量策略",
    "Password": "密码",
    "Password is required.": "密码是必填项",
    "Password or Token": "密码或令牌",
    "Password or token for Git authentication. Required if a ca.crt or .gitconfig file is not specified.": "Git身份验证的密码或令牌。如果未指定ca.crt或.gitconfig文件，则为必需。",
    "Password or token is required.": "密码或令牌是必需的。",
    "Path": "路径",
    "Path at which to mount the secret.": "挂载秘钥的路径。",
    "Path must be a relative path. It cannot start with": "路径必须是相对路径。它无法开始于",
    "Path must start with": "路径必须从",
    "Path that the router watches to route traffic to the service.": "路由器监视将路由路由到服务的路径。",
    "Path value will not be used. Paths cannot be set for passthrough TLS.": "不会使用路径值。无法为直通TLS设置路径。",
    "Path:": "路径:",
    "Paths must be unique.": "路径必须是唯一的。",
    "Paths:": "路径：",
    "Pause Rollouts": "暂停滚动",
    "Pause rollouts for this {{deployment.kind | humanizeKind}}": "暂停此{{deployment.kind | humanizeKind}}的滚动",
    "Pausing lets you make changes without triggering a rollout. You can resume rollouts at any time.": "暂停可让您在不触发滚动的情况下进行更改。您可以随时恢复滚动。",
    "Pending": "待定",
    "Percentage of traffic sent to each service. Drag the slider to adjust the values or": "发送到每项服务的流量百分比。拖动滑块可调整值或",
    "Permissions to the mounted volume.": "挂载卷的权限",
    "Pick the config source. Its data will be mounted as a volume in the container.": "选择配置源。其数据将作为卷安装在容器中。",
    "Pipeline": "管道",
    "Pipeline Builds": "管道构建",
    "Pipelines": "管道",
    "Plan": "计划",
    "Please enter a valid name.": "请输入有效的名字",
    "Please enter a valid prefix.": "请输入有效的前缀。",
    "Pod Metrics": "容器组指标",
    "Pod status:": "容器组状态",
    "Pods": "容器组",
    "Policy for traffic on insecure schemes like HTTP.": "HTTP等不安全方案的流量策略。",
    "Port": "端口",
    "Ports": "端口",
    "Ports:": "端口:",
    "Post Lifecycle Hook": "后生命周期挂钩",
    "Post hooks execute after the deployment strategy completes.": "在部署策略完成后执行后挂钩。",
    "Post-Commit Hooks": "后提交挂钩",
    "Pre Lifecycle Hook": "前生命周期挂钩",
    "Pre hooks execute before the deployment begins.": "在部署开始之前执行前挂钩。",
    "Prefix": "前缀",
    "Prefix can contain numbers, letters, and underscores, but can not start with a number.": "前缀可以包含数字，字母和下划线，但不能以数字开头。",
    "Private Key": "私钥",
    "Private SSH key file for Git authentication.": "用于Git身份验证的私有SSH密钥文件。",
    "Process the template": "处理模板",
    "Progress Deadline:": "进度截止日期：",
    "Project Name": "项目名称",
    "Project Quota": "项目配额",
    "Prompt for manual input:": "提示手动输入：",
    "Provider: {{ resource | annotation:'provider' }}": "提供者：{{ resource | annotation:'provider' }}",
    "Provider: {{imageStream | imageStreamTagAnnotation : 'provider' : is.tag.tag}}": "提供者: {{imageStream | imageStreamTagAnnotation : 'provider' : is.tag.tag}}",
    "Provider: {{template | annotation : 'provider'}}": "提供者: {{template | annotation : '提供者'}}",
    "Provisioned Services": "预配服务",
    "Public hostname for the route.": "路由的公共主机名。",
    "Push Secret:": "推送的秘钥:",
    "Push To": "推向",
    "Quota": "配额",
    "Ratio": "转换率",
    "Read Only (ROX)": "只读（ROX）",
    "Read only": "只读",
    "Readiness Probe": "准备情况探头",
    "Readiness Probe:": "准备情况探头",
    "Ready:": "准备",
    "Reason": "原因",
    "Reason and": "原因和",
    "Rebuild": "重建",
    "Receiving Traffic": "接收流量",
    "Recent Runs": "最近的运行",
    "Red Hat OpenShift": "红帽OpenShift",
    "Refer to the": "请参阅",
    "Rejected by router '{{ingress.routerName}}'": "被路由器 '{{ingress.routerName}}'拒绝",
    "Reload": "重新加载",
    "Remove": "删除",
    "Remove Item": "删除条目",
    "Remove Liveness Probe": "删除活动探测",
    "Remove Readiness Probe": "删除准备探测",
    "Remove Service": "删除服务",
    "Remove Webhook trigger": "删除Webhook触发器",
    "Remove build secret": "删除构建秘钥",
    "Remove {{service.metadata.name}} from service group": "从服务组中删除{{service.metadata.name}}",
    "Remove {{type | upperFirst}} Lifecycle Hook": "删除{{type | upperFirst}}生命周期钩子",
    "Replace": "替换",
    "Replica Sets": "副本集",
    "Replicas": "副本",
    "Replicas can't be negative.": "副本数不能为负数。",
    "Replicas must be a whole number.": "副本数必须是整数。",
    "Replicas must be an integer value greater than or equal to 0.": "副本数必须是大于或等于0的整数值。",
    "Replicas:": "副本：",
    "Replication Controllers": "复制控制器",
    "Repository:": "仓库:",
    "Request": "请求",
    "Requested Capacity:": "请求的容量：",
    "Requests and": "请求和",
    "Resource Limits: {{name}}": "资源限制：{{name}}",
    "Resource Type": "资源类型",
    "Resource limits control how much": "资源限制控制了多少",
    "Restart": "重启",
    "Restart Count:": "重启次数：",
    "Restart Policy:": "重启策略",
    "Resume Rollouts": "恢复滚动",
    "Retry the hook until it succeeds.": "重试钩子直到成功。",
    "Return to the": "返回到",
    "Revision History Limit:": "修订历史限制：",
    "Revision:": "修订版本：",
    "Roles": "角色",
    "Roll Back": "回滚",
    "Route": "路由",
    "Routes": "路由",
    "Routes - External Traffic": "路由 - 外部流量",
    "Routes can be secured using several TLS termination types for serving certificates.": "可以使用多种TLS终止类型来保护路由以提供证书。",
    "Routes can direct traffic to multiple services for A/B testing. Each service has a weight controlling how much traffic it gets.": "路由可以将流量引导到多个服务以进行A / B测试。每项服务都有一个权重控制它获得的流量。",
    "Routes:": "路由：",
    "Routing is a way to make your application publicly visible.": "路由是一种使您的应用程序公开可见的方法。",
    "Run Policy": "运行策略",
    "Run Policy:": "运行策略:",
    "Run a specific command in a new pod": "在新容器组中运行特定命令",
    "Run an OpenShift build and deployment:": "运行OpenShift构建和部署：",
    "Run build hooks after image is built": "构建映像后运行构建挂钩",
    "Run policy type": "运行策略类型",
    "Runs a command in a new pod using the container from the deployment template. You can add additional environment variables and volumes.": "使用部署模板中的容器在新窗格中运行命令。您可以添加其他环境变量和卷。",
    "SSH Private Key": "SSH私钥",
    "Sample repository for {{imageName}}:": "{{imageName}}的示例仓库：",
    "Save": "保存",
    "Save partial log for": "保存部分日志",
    "Scale Down": "向下扩展",
    "Scale down": "向下扩展",
    "Scale down {{type}}": "向下扩展 {{type}}",
    "Scale replicas automatically based on CPU usage.": "根据CPU使用情况自动扩展副本。",
    "Scale replicas manually or automatically based on CPU usage.": "根据CPU使用情况手动或自动扩展副本。",
    "Scale up": "向上扩展",
    "Scaling may be affected.": "扩展可能会受到影响。",
    "Scopes:": "作用域：",
    "Script": "脚本",
    "Script:": "脚本:",
    "Secret": "秘钥",
    "Secret Name": "秘钥名称",
    "Secret Type": "秘钥类型",
    "Secret for authentication when pulling images from a secured registry.": "从安全注册表中提取映像时的身份验证的秘钥。",
    "Secret for authentication when pushing images to a secured registry.": "将映像推送到安全注册表时进行身份验证的秘钥。",
    "Secret reference is required.": "秘钥参考是必需的。",
    "Secret with credentials for pulling your source code.": "提取源代码的秘钥证书。",
    "Secret:": "秘钥:",
    "Secrets": "秘钥",
    "Secrets allow you to authenticate to a private Git repository or a private image registry.": "秘钥允许您对私有Git仓库或私有映像注册表进行身份验证。",
    "Secure route": "安全路由",
    "Security": "安全",
    "Select": "选择",
    "Select a binding to delete from": "选择要从中删除的绑定",
    "Select a resource from the list above...": "从上面的列表中选择一个资源..。",
    "Select an image stream tag or enter an image name.": "选择映像流标记或输入映像名称。",
    "Select from Project": "从项目中选择",
    "Select specific keys and paths": "选择特定的键和路径",
    "Select storage to use": "选择要使用的存储",
    "Select storage to use.": "选择要使用的存储。",
    "Select the keys to use and the file paths where each key will be exposed.": "选择要使用的密钥以及将公开每个密钥的文件路径。",
    "Selector": "选择器",
    "Selector:": "选择器",
    "Selectors:": "选择器",
    "Service": "服务",
    "Service - Internal Traffic": "服务 - 内部流量",
    "Service Account": "服务帐户",
    "Service Catalog": "服务目录",
    "Service Port": "服务端口",
    "Service Weights": "服务权重",
    "Service account": "服务账户",
    "Service to route to.": "服务路由到",
    "Service {{duplicate.metadata.name}} cannot be added twice.": "服务{{duplicate.metadata.name}}无法添加两次。",
    "Service {{model.name}} does not exist.": "服务{{model.name}}不存在。",
    "Service {{model.name}} has a single, unnamed port. A route cannot specifically target an unnamed service port. If more service ports are added later, the route will also direct traffic to them.": "服务 {{model.name}}有一个未命名的端口。路由不能专门针对未命名的服务端口。如果稍后添加了更多服务端口，则该路由还会将流量定向到它们。",
    "Service {{route.to.service.metadata.name}} Weight": "服务{{route.to.service.metadata.name}}权重",
    "Services": "服务",
    "Session Timeout Warning": "会话超时警告",
    "Session affinity:": "会话亲和性：",
    "Set Home Page": "设置主页",
    "Set to the key {{entry.valueFrom.configMapKeyRef.key}} in config map": "设置为配置映射中的键值{{entry.valueFrom.configMapKeyRef.key}}",
    "Set to the key {{entry.valueFrom.secretKeyRef.key}} in secret": "键值设置为密钥{{entry.valueFrom.secretKeyRef.key}}",
    "Severity": "严重程度",
    "Shared Access (RWX)": "共享访问（RWX）",
    "Show Image Environment Variables": "显示映像环境变量",
    "Show Obfuscated Secret": "显示模糊的秘钥",
    "Show hidden roles": "显示隐藏的角色",
    "Show parameter values": "显示参数值",
    "Single User (RWO)": "单用户（RWO）",
    "Size": "大小",
    "Size is required.": "必须填写大小。",
    "Some items already exist:": "有些项目已存在：",
    "Sort by": "按排序",
    "Source": "源",
    "Source Commit:": "源提交：",
    "Source Configuration": "源配置",
    "Source Context Dir:": "源上下文目录：",
    "Source Ref:": "源参考",
    "Source Repo:": "源repo",
    "Source Repository:": "源仓库：",
    "Source Type:": "源类型：",
    "Source and Destination Paths": "源和目标路径",
    "Source code from": "源代码来自",
    "Source secret to copy into the builder pod at build time.": "在构建时复制到构建容器组中的源秘钥。",
    "Source secret to mount into the builder pod at build time.": "在构建时挂载到构建器窗格中的源秘钥。",
    "Source:": "源：",
    "Source: {{build.spec.source.type}}": "源：{{build.spec.source.type}}",
    "Specify details about how volumes are going to be mounted inside containers.": "指定有关如何在容器内装入卷的详细信息。",
    "Split traffic across multiple services": "跨多个服务拆分流量",
    "Start": "开始",
    "Start Build": "开始构建",
    "Start Deployment": "开始部署",
    "Start Pipeline": "启动管道",
    "Start a new build to create an image from": "启动新构建以从中创建映像",
    "Started:": "已开始：",
    "State:": "状态:",
    "Stateful Sets": "状态集",
    "Status": "状态",
    "Status Reason:": "状态原因：",
    "Status has not been reported on this quota usage record.  Any resources limited by this quota record can not be allocated.": "尚未报告此配额使用记录的状态。无法分配受此配额记录限制的任何资源。",
    "Status:": "状态:",
    "Stop": "停止",
    "Stop Following": "停止跟随",
    "Storage": "存储",
    "Storage Class": "存储类",
    "Storage claim: {{template.metadata.name}}": "存储定义：{{template.metadata.name}}",
    "Storage classes are set by the administrator to define types of storage the users can select.": "管理员设置存储类以定义用户可以选择的存储类型。",
    "Storage quota limit has been reached. You will not be able to create any new storage.": "已达到存储配额限制。您将无法创建任何新存储。",
    "Storage quota will be exceeded.": "将超出存储配额。",
    "Strategy": "策略",
    "Strategy Type": "策略类型",
    "Strategy:": "策略:",
    "Subpath": "子路径",
    "Success": "成功",
    "Switch to {{multiline ? 'Single-line' : 'Multiline'}} Editor": "切换到{{multiline ? 'Single-line' : 'Multiline'}}编辑",
    "TLS Settings": "TLS设置",
    "TLS Termination": "TLS终止",
    "TLS certificates for edge and re-encrypt termination. If not specified, the router's default certificate is used.": "用于边缘和重新加密终止的TLS证书。如果未指定，则使用路由器的默认证书。",
    "TLS is not enabled.": "TLS 不可用",
    "Tag": "标记",
    "Tag As": "标记为",
    "Tag image as": "将标记标记为",
    "Tag image if the deployment succeeds": "如果部署成功，则标记映像",
    "Tags": "标记",
    "Tags the current image as an image stream tag if the deployment succeeds.": "如果部署成功，则将当前映像标记为映像流标记。",
    "Target CPU percentage must be a number.": "目标CPU百分比必须是一个数字。",
    "Target CPU percentage must be a whole number.": "目标CPU百分比必须是整数。",
    "Target CPU percentage must be greater than 1.": "目标CPU百分比必须大于1。",
    "Target Port": "目标端口",
    "Target Port:": "目标端口：",
    "Target port for traffic.": "用于通信的目标端口。",
    "Template": "模板",
    "Terminal": "终端",
    "Termination Type:": "终端类型",
    "The DNS admin should set up a CNAME from the route's hostname, {{ingress.host}}, to the router's canonical hostname, {{ingress.routerCanonicalHostname}}.": "DNS管理员应该将路由的主机名{{ingress.host}}中的CNAME设置为路由器的规范主机名{{ingress.routerCanonicalHostname}}。",
    "The build strategy had no environment variables defined.": "构建策略没有定义环境变量。",
    "The builder image has additional environment variables defined.  Variables defined below will overwrite any from the image with the same name.": "构建器映像具有定义的其他环境变量。下面定义的变量将覆盖具有相同名称的映像中的任何变量。",
    "The certificate or key you've set will not be used.": "您设置的证书或密钥将不会被使用。",
    "The complete list of your projects could not be loaded.": "无法加载项目的完整列表。",
    "The config map could not be loaded.": "无法加载配置映射。",
    "The config map has no items.": "配置映射没有条目。",
    "The contents of each file will be the value of the key.": "每个文件的内容都是密钥的值。",
    "The current filter is hiding all projects.": "当前过滤器隐藏所有项目。",
    "The current filters are hiding all builds.": "当前筛选器隐藏了所有构建。",
    "The current filters are hiding all deployments.": "当前筛选器隐藏了所有部署。",
    "The current filters are hiding all pods.": "当前筛选器隐藏了所有构建。",
    "The current filters are hiding all stateful sets.": "当前筛选器隐藏了所有有状态集。",
    "The current value is \"{{parameter.value}}\", which is not empty.": "当前值为 \"{{parameter.value}}\", 它不是空的。",
    "The custom strategy allows you to specify container image that will provide your own deployment behavior.": "自定义策略允许您指定将提供您自己的部署行为的容器映像。",
    "The destination CA certificate will be removed from the route. Destination CA certificates are only used for re-encrypt termination.": "目标CA证书将从路由中删除。目标CA证书仅用于重新加密终止。",
    "The file paths are relative to the mount path.": "文件路径相对于挂载路径。",
    "The filter is hiding all builds.": "过滤器隐藏所有构建。",
    "The filter is hiding all config maps.": "筛选器隐藏了所有配置映射。",
    "The filter is hiding all deployments.": "筛选器隐藏了所有部署。",
    "The filter is hiding all image streams.": "筛选器隐藏了所有映像流。",
    "The filter is hiding all persistent volume claims.": "筛选器隐藏了所有持久的卷定义。",
    "The filter is hiding all pods.": "过滤器隐藏了所有容器组。",
    "The filter is hiding all provisioned services.": "过滤器隐藏所有配置的服务。",
    "The filter is hiding all resources.": "过滤器隐藏所有资源。",
    "The filter is hiding all routes.": "过滤器隐藏的所有事件。",
    "The filter is hiding all secrets.": "过滤器隐藏了所有秘钥。",
    "The filter is hiding all services.": "筛选器隐藏了所有服务。",
    "The filter is hiding all stateful sets.": "筛选器隐藏所有有状态集。",
    "The filter is hiding all {{resourceName}}.": "筛选器正在隐藏所有 {{resourceName}}。",
    "The hostname can't be changed after the route is created.": "创建路由后, 无法更改主机名。",
    "The image may not exist or it may be in a secure registry. Check that you have entered the image name correctly or": "映像可能不存在, 也可能位于安全注册表中。检查您输入的映像名称是否正确或",
    "The key must have at least {{secretReferenceValidation.minLength}} characters.": "密钥必须至少包含{{secretReferenceValidation.minLength}}个字符。",
    "The log might not be complete. Continuing will save only the content currently displayed.": "日志可能不完整。继续将仅保存当前显示的内容。",
    "The lower limit for the number of pods that can be set by the autoscaler. If not specified, defaults to 1.": "可由自动计频器设置的容器组数量的下限。如果未指定, 则默认为1。",
    "The maximum number of pods that can be scheduled above the original number of pods while the rolling deployment is in progress. This can be either a percentage (10%) or a whole number (1).": "滚动部署正在进行时，可以在原始容器组数量之上调度的最大容器组数，这可以是百分比（10％）或整数（1）。",
    "The maximum number of pods that can be unavailable during the rolling deployment. This can be either a percentage (10%) or a whole number (1).": "滚动部署期间可以使用的最大容器组数。这可以是百分比（10％）或整数（1）。",
    "The maximum web console log size has been reached. Use the command-line interface or": "已达到最大 web 控制台日志大小。使用命令行界面或",
    "The mount path is already used. Please choose another mount path.": "已使用装载路径。请选择其他装载路径。",
    "The name must have at least 2 characters.": "名称必须至少包含2个字符。",
    "The number of instances of your image.": "映像的实例数。",
    "The percentage of the CPU request that each pod should ideally be using. Pods will be added or removed periodically when CPU usage exceeds or drops below this target value.": "理想情况下每个容器组应使用的CPU请求百分比。当CPU使用率超过或低于此目标值时，将定期添加或删除容器组。",
    "The recreate strategy has basic rollout behavior and supports lifecycle hooks for injecting code into the deployment process.": "重新创建策略具有基本的推出行为, 并支持将代码注入部署过程的生命周期挂钩。",
    "The requested capacity may not be less than the current capacity.": "请求的容量不得小于当前容量。",
    "The rolling strategy will wait for pods to pass their readiness check, scale down old components and then scale up.": "滚动策略将等待容器组通过准备情况检查, 缩小旧组件的规模, 然后向上扩展。",
    "The route is not accepting traffic yet because it has not been admitted by a router.": "该路由尚未接受流量，因为它尚未被路由器接受。",
    "The route is unsecured.": "该路由是不安全的。",
    "The service failed.": "服务失败了。",
    "The service is not yet ready.": "该服务尚未准备好。",
    "The service was marked for deletion": "该服务已标记为删除",
    "The service was marked for deletion.": "该服务已标记为删除。",
    "The upper limit for the number of pods that can be set by the autoscaler.": "自动扩展器可以设置的容器组数量的上限。",
    "The volume will be mounted into all containers. You can  instead": "该卷将安装到所有容器中。相反, 您可以",
    "The volume will be mounted into all containers. You can instead": "该卷将安装到所有容器中。相反, 您可以",
    "The {{$ctrl.overlayPaneEntryDetails.kind | humanizeKind}} has no properties.": "{{$ ctrl.overlayPaneEntryDetails.kind | humanizeKind}}没有属性。",
    "The {{ctrl.apiObject.kind | humanizeKind}} has already been added to this application.": "{{ctrl.apiObject.kind | humanizeKind}}已添加到此应用程序中。",
    "The {{ctrl.apiObject.kind | humanizeKind}} will be added to all containers. You can": "{{ctrl.apiObject.kind | humanizeKind}}将被添加到所有容器中。您可以",
    "The {{kind | humanizeKind}} could not be loaded.": "{{kind | humanizeKind}}无法加载。",
    "The {{type}} has no items.": "{{type}}没有条目。",
    "There are no": "没有",
    "There are no annotations on this resource.": "此资源上没有批注。",
    "There are no builds in this project.": "这个项目没有构建。",
    "There are no config maps or secrets in project {{project | displayName}} to use as a volume for this {{kind | humanizeKind}}.": "项目中没有配置映射或秘钥{{project | displayName}}用作此{{kind | humanizeKind}}。",
    "There are no deployments in this project.": "此项目中没有部署。",
    "There are no editable source types for this build config.": "此构建配置没有可编辑的源类型。",
    "There are no pods in this project.": "这个项目没有容器组。",
    "There are no resource quotas set on this project.": "此项目没有设置资源配额。",
    "There are no service bindings.": "没有服务绑定。",
    "There are no stateful sets in this project.": "此项目中没有状态集。",
    "There are no {{ subjectKind.name | humanizeKind }}s with access to this project.": "没有可以访问此项目的 {{ subjectKind.name | humanizeKind }}。",
    "There was an error reading the file. Please copy the file content into the text area.": "读取文件时出错。请将文件内容复制到文本区域。",
    "These parameters often include things like passwords. If you will need to reference these values later, copy them to a safe location.": "这些参数通常包括密码等内容。如果稍后需要引用这些值，请将它们复制到安全位置。",
    "These variables exist on the image and will be available at runtime. You may override them below.": "这些变量存在于映像上，并且在运行时可用。您可以在下面覆盖它们。",
    "This autoscaler uses a newer API, consider editing it with the": "此自动扩展器使用较新的API，请考虑使用",
    "This can be a time-consuming process.": "这可能是一个耗时的过程。",
    "This deployment config is part of the pipeline": "此部署配置是管道的一部分",
    "This file contains binary content.": "该文件包含二进制内容。",
    "This image declares volumes and will default to use non-persistent, host-local storage. You can add persistent storage later to the deployment config.": "此映像声明卷，默认使用非持久性主机本地存储。您可以稍后在部署配置中添加持久存储。",
    "This name is already in use within the project. Please choose a different name.": "该名称已在项目中使用，请选择其他名称。",
    "This pauses any in-progress rollouts and stops new rollouts from running until the deployment is resumed.": "这将暂停任何正在进行的部署, 并停止新的部署运行, 直到恢复部署。",
    "This pipeline is not associated with any deployments.": "此管道不与任何部署关联。",
    "This resource has an autoscaler associated with it. It is recommended you delete the autoscaler with the resource it scales.": "此资源具有与之关联的自动扩展器。建议您使用自动缩放的资源删除自动缩放程序。",
    "This resource has autoscalers associated with it. It is recommended you delete the autoscalers with the resource they scale.": "此资源具有与之关联的自动扩展器。建议您使用他们扩展的资源删除自动扩展器。",
    "This route splits traffic across multiple services.": "跨多个服务拆分流量",
    "This secret has no data.": "这个秘钥没有数据。",
    "This secret value contains non-printable characters and is displayed as a Base64-encoded string.": "此秘钥值包含不可打印的字符，并显示为Base64编码的字符串。",
    "This target port will route to {{route | routeTargetPortMapping : services[route.spec.to.name]}}.": "此目标端口将路由到{{route | routeTargetPortMapping：services [route.spec.to.name]}}。",
    "This temporary pod has a modified entrypoint command to debug a failing container. The pod will be available for one hour and will be deleted when the terminal window is closed.": "此临时容器组具有修改的入口点命令以调试失败的容器。该容器组将可用一小时，并在终端窗口关闭时删除。",
    "This will delete all resources associated with the project {{displayName ? displayName : resourceName}}.": "这将删除与项目相关的所有资源{{displayName？ displayName：resourceName}}。",
    "This will delete the deployment config, all rollout history, and any running pods.": "这将删除部署配置，所有部署历史记录和任何正在运行的容器组。",
    "This will delete the deployment, all rollout history, and any running pods.": "这将删除部署，所有部署历史记录和任何正在运行的容器组。",
    "This will delete the {{typeDisplayName || (kind | humanizeKind)}} and any running pods.": "这将删除{{typeDisplayName || （kind | humanizeKind）}}和任何正在运行的容器组。",
    "This will prevent a value from being generated.": "这将阻止生成值。",
    "This will stop any new rollouts or triggers from running until resumed.": "这将阻止任何新的滚动或触发器运行直到恢复。",
    "This {{targetKind | humanizeKind}} does not have any containers with a CPU": "这{{targetKind | humanizeKind}}没有任何带CPU的容器",
    "Time": "时间",
    "Time Range:": "时间范围：",
    "Time to wait between polling deployment status after running a pod.": "运行容器组后轮询部署状态之间等待的时间。",
    "Time to wait between retrying to run individual pod.": "在重试运行单个pod容器组之间等待的时间。",
    "Timeout": "超时时间",
    "Timeout can't be negative.": "超时时间不能是负数。",
    "Timeout must be greater than or equal to one.": "超时时间必须大于或等于1。",
    "Timeout:": "超时时间:",
    "To add an image stream or template from a file, use the editor in the": "若要从文件中添加映像流或模板, 请使用",
    "To claim storage from a persistent volume, refer to the documentation on": "要从持久卷中定义存储，请参阅上的文档",
    "To deploy an image from a private repository, you must": "要从私有仓库部署映像，您必须",
    "To get the complete log, run the command": "要获取完整日志，请运行该命令",
    "To learn more, visit the OpenShift": "要了解更多信息, 请访问 openshift",
    "To see application logs, view the logs for one of the replica set's": "若要查看应用程序日志, 请查看副本集之一的日志",
    "To see application logs, view the logs for one of the stateful sets's": "若要查看应用程序日志, 请查看其中一个有状态集的日志",
    "To set additional parameters or edit lifecycle hooks, view": "若要设置其他参数或编辑生命周期挂钩, 请查看",
    "To set secrets for pulling your images from private image registries, view": "要设置从私有映像注册表中提取映像的秘钥, 请查看",
    "To show a high level overview of the current project:": "要显示当前项目的高级概述：",
    "Toggle Token Visibility": "切换令牌可见性",
    "Traffic": "流量",
    "Traffic Split": "流量分割",
    "Traffic {{(weightByService[service.metadata.name] / totalWeight) | percent}}": "流量 {{(weightByService[service.metadata.name] / totalWeight) | percent}}",
    "Trigger": "触发",
    "Triggered By:": "触发：",
    "Triggers": "触发",
    "Try It": "尝试一下！",
    "Type": "类型",
    "Type a project name to go to that project.": "键入要转到该项目的项目名称。",
    "Type the name of the {{typeDisplayName || (kind | humanizeKind)}} to confirm.": "键入  {{typeDisplayName || (kind | humanizeKind)}} 以确认。",
    "Type:": "类型：",
    "Type: {{sclass.parameters.type}}": "类型: {{sclass.parameters.type}}",
    "Unique name of the new secret.": "新秘钥的唯一名称。",
    "Unique name used to identify this volume. If not specified, a volume name is generated.": "用于标识此卷的唯一名称。如果未指定，则生成卷名。",
    "Unit": "单元",
    "Unknown": "未知",
    "Update Period": "更新周期",
    "Update Period:": "更新周期：",
    "Update period can't be negative.": "更新周期不能为负。",
    "Update the display name and description of your project. The project's unique name cannot be modified.": "更新项目的显示名称和说明。无法修改项目的唯一名称。",
    "Updated": "已更新",
    "Uptime:": "运行时间：",
    "Usage": "用法",
    "Use HTTPS": "使用 HTTPS",
    "Use a Jenkinsfile from the source repository or specify the Jenkinsfile content directly in the build configuration.": "使用源仓库中的Jenkinsfile或直接在构建配置中指定Jenkinsfile内容。",
    "Use a custom .gitconfig file": "使用自定义. gitconfig 文件",
    "Use a custom ca.crt file": "使用自定义 ca. crt 文件",
    "Use all keys and values from": "使用中的所有键和值",
    "Use label selectors to request storage": "使用标签选择器请求存储",
    "Use the following settings from {{replicaSet.metadata.name}} when rolling back:": "回滚时, 请使用 {{replicaSet.metadata.name} 中的以下设置:",
    "Use the image for this container as the source of the tag.": "使用此容器的映像作为标记的来源。",
    "Used": "已使用",
    "Used (All Projects)": "已使用（所有项目）",
    "Used (This Project)": "已使用（所有项目）",
    "Username": "用户名",
    "Username is required.": "用户名是必须的。",
    "Value": "值",
    "Value of the secret will be supplied when invoking the webhook.": "在调用 webhook 时, 将提供秘钥的值。",
    "Version: {{ resource | annotation:'version' }}": "版本: {{ resource | annotation:'version' }}",
    "View All Events": "查看所有事件",
    "View Archive": "查看归档",
    "View Details": "查看详细信息",
    "View Events": "查看事件",
    "View Full Log": "查看完整日志",
    "View Log": "查看日志",
    "View Logs": "查看日志",
    "View Pipeline Runs": "查看管道运行",
    "View Quota": "查看配额",
    "View Secret": "查看密钥",
    "View pods for {{rc | displayName}}": "查看 {{rc | displayName}} 的容器组",
    "View the": "查看",
    "View the file": "查看文件",
    "Virtual Machine": "虚拟机",
    "Virtual Machines": "虚拟机",
    "Volume": "卷",
    "Volume File:": "卷文件",
    "Volume Name": "卷名称",
    "Volume mount in that path already exists. Please choose another mount path.": "该路径中的卷装入已存在。请选择其他安装路径。",
    "Volume name already exists. Please choose another name.": "卷名已经存在。请另选一个。",
    "Volume names cannot be longer than 63 characters.": "卷名称不能超过63个字符。",
    "Volume names may only contain lower-case letters, numbers, and dashes. They may not start or end with a dash.": "卷名称只能包含小写字母，数字和短划线。它们可能无法以短划线开始或结束。",
    "Volumes": "卷",
    "Volumes:": "卷：",
    "Waiting for container {{container.name}} to start...": "等待容器{{container.name}}开始......",
    "Warning": "警告",
    "Warning:": "警告：",
    "Warning: The deployment's deployment config is missing.": "警告：缺少部署的部署配置。",
    "Warnings": "警告",
    "Webhook Secret Key": "Webhook密钥",
    "Weight": "权重",
    "Weight is a number between 0 and 256 that specifies the relative weight against otherroute services.": "权重是0到256之间的数字，用于指定与其他路由服务相对的权重。",
    "Welcome to OpenShift.": "欢迎来到天固彩石云平台软件。",
    "Welcome to project {{projectName}}.": "欢迎使用项目 {{projectName}}。",
    "What are": "什么是",
    "What are GiB?": "什么是GiB？",
    "What would you like to do?": "您想要做什么？",
    "What's a Jenkinsfile?": "什么是Jenkinsfile？",
    "When you navigate away from this pod, any open terminal connections will be closed. This will kill any foreground processes you started from the&nbsp;terminal.": "当您离开此容器组时, 任何打开的终端连接都将关闭。这将终止您从 &nbsp; 终端启动的任何前台进程。",
    "Wildcard Policy:": "通配符策略：",
    "Wildcard subdomains may start with": "通配符子域可以以。开头",
    "With the OpenShift command line interface (CLI), you can create applications and manage OpenShift projects from a terminal.": "使用NeokylinKube命令行界面（CLI），您可以从终端创建应用程序并管理NeokylinKube项目。",
    "With the OpenShift command line interface (CLI), you can create applications and manage OpenShift projects from a terminal. To get started using the CLI, visit": "使用NeokylinKube命令行界面 (cli), 您可以创建应用程序并从终端管理 NeokylinKube项目。要开始使用 cli, 请访问",
    "Yes": "是",
    "You are about to change users from": "您即将更改用户",
    "You are being logged in as": "你是登录为",
    "You are currently logged in under the user account": "您当前以用户帐户登录",
    "You are not authorized to add to this project.": "您无权添加到此项目。",
    "You are set up to use the example git repository. If you would like to modify the source code, fork the": "您将被设置为使用示例 git 仓库。如果您想修改源代码, 请创建分叉",
    "You can configure the webhook in the forked repository's settings, using the following payload URL:": "您可以使用以下有效负载 url 在分叉仓库的设置中配置 web 钩子:",
    "You can download the": "你可以下载",
    "You can grant authority with the command:": "您可以使用以下命令授予权限：",
    "You can now set up the webhook in the GitHub repository settings if you own it, in": "您现在可以在GitHub仓库设置中设置webhook（如果您拥有它）",
    "You can use": "您可以使用",
    "You do not have permission to view roles in this project.": "您无权查看此项目中的角色。",
    "You must have a bindable service in your namespace in order to create bindings.": "要创建绑定, 必须在命名空间中具有可绑定服务。",
    "You must select at least one container.": "您必须至少选择一个容器。",
    "You should configure resource limits below for autoscaling. Autoscaling will not work without a CPU request.": "您应该在下面配置资源限制以进行自动扩展。没有CPU请求，自动扩展将无法工作。",
    "You will be logged out in": "你将被登出",
    "You will need to redeploy your pods for this to take effect.": "您需要重新部署容器组才能使其生效。",
    "You'll need to copy any changes you've made and edit the config map again.": "您需要复制所做的任何更改并再次编辑配置映射。",
    "Your session is about to expire due to inactivity.": "由于不活动，您的会话即将过期。",
    "Your source does not appear to be a URL to a GitHub repository.  If you have a GitHub repository that you want to trigger this build from then use the following payload URL and specifying a": "您的源似乎不是GitHub仓库的URL。如果您要从之后触发此构建的GitHub仓库，请使用以下有效内容URL并指定",
    "Zone: {{sclass.parameters.zone}}": "区域: {{sclass.parameters.zone}}",
    "additional": "附加",
    "advanced image options.": "高级映像选项",
    "advanced strategy options.": "高级策略选项。",
    "ago": "前",
    "allocated unknown size": "分配未知的大小",
    "already exists.": "已经存在。",
    "an image is pushed to": "映像被推送到",
    "and": "和",
    "and the": "和",
    "and {{imageStream.status.tags.length - 4}} others": "和{{imageStream.status.tags.length  -  4}}其他人",
    "any": "任何",
    "authored by {{build.spec.revision.git.author.name}}": "由{{build.spec.revision.git.author.name}}创作",
    "authored by {{trigger.githubWebHook.revision.git.author.name || trigger.genericWebHook.revision.git.author.name}},": "由 {{{trigger.githubWebHook.revision.git.author.name trigger.genericWebHook.revision.git.author.name} 创作,",
    "build config": "构建配置",
    "build config.": "构建配置。",
    "build configuration": "构建配置",
    "build configuration {{buildConfig.metadata.name}}.": "构建配置{{buildConfig.metadata.name}}。",
    "change": "更改",
    "clear the value": "清除值",
    "client tool using the links below. For more information about downloading and installing it, please refer to the": "使用以下链接的客户端工具。有关下载和安装它的更多信息，请参阅",
    "client tool.": "客户端工具。",
    "command line tools": "命令行工具",
    "completed successfully": "成功完成",
    "config map": "配置映射:",
    "config map {{entry.configMapRef.name}}.": "配置映射 {{entry.configMapRef.name}}。",
    "console": "控制台",
    "contain": "包含",
    "contains keys that are not valid environment variable names. Only {{ctrl.apiObject.kind | humanizeKind}} keys with valid names will be added as environment variables.": "包含无效环境变量名称的键。只有{{ctrl.apiObject.kind | humanizeKind}}具有有效名称的键将被添加为环境变量。",
    "contains keys that are not valid environment variable names. Only {{entry.selectedEnvFrom.kind | humanizeKind}} keys with valid names will be added as environment variables.": "包含不是有效的环境变量名的键。只有  {{entry.selectedEnvFrom.kind | humanizeKind}} 键的有效名称将被添加为环境变量。",
    "create an image pull secret": "创建映像并拉取秘钥",
    "create storage": "创建存储",
    "created from": "创建",
    "debugging": "调试",
    "default": "默认",
    "deployment config or deployment.": "部署配置或部署。",
    "deployment strategy": "部署策略",
    "deployment trigger": "部署触发器",
    "documentation": "文档",
    "documentation for instructions about downloading and installing the": "有关下载和安装的说明的文档",
    "documentation.": "文档。",
    "downward API": "下载API",
    "edit the": "编辑",
    "edit weights as integers": "将权重编辑为整数",
    "elapsed": "已经过",
    "email": "邮箱",
    "empty dir": "空目录",
    "encountered an error": "遇到错误",
    "encountered an error.": "遇到错误。",
    "error": "错误",
    "failed": "失败",
    "failed.": "失败",
    "for container {{options.selectedContainer.name}}": "用于容器 {{options.selectedContainer.name}}",
    "for source, routes, builds, and deployments.": "用于源，路由，构建和部署。",
    "from image": "来自映像",
    "from parameter": "来自参数",
    "git repo": "git repo",
    "has been created for the": "已经创建了",
    "has been deleted since you started editing it.": "已被删除, 因为您开始编辑它。",
    "has changed since you started editing it. You'll need to copy any changes you've made and edit the {{updated.resource.kind | humanizeKind}} again.": "自从您开始编辑它以来已发生了更改。您需要复制所做的任何更改, 并再次编辑e {{updated.resource.kind | humanizeKind}}。",
    "helps you learn about OpenShift and start exploring its features. From getting started with creating your first application to trying out more advanced build and deployment techniques, it provides guidance on setting up and managing your OpenShift environment as an application developer.": "帮助您了解NeokylinKube并开始探索其功能。从开始创建第一个应用程序到尝试更高级的构建和部署技术, 它提供了有关作为应用程序开发人员设置和管理NeokylinKube环境的指导。",
    "host path": "主机路径",
    "in the": "在",
    "info": "信息",
    "instead.": "代替。",
    "is": "是",
    "is Red Hat's container application platform that allows developers to quickly develop, host, and scale applications in a cloud environment.": "是中标软件容器应用程序平台, 允许开发人员在云环境中快速开发、托管和扩展应用程序。",
    "is required to attach to this {{kind | humanizeKind}}, but none are loaded on this project.": "需要附加到此 {{kind | humanizeKind}}， 但没有在此项目上加载任何内容。",
    "limit": "限制",
    "limit reached.": "达到极限。",
    "limit.": "限度。",
    "max: {{hpa[0].spec.maxReplicas}}": "最大：{{hpa [0] .spec.maxReplicas}}",
    "memory a container will consume on a node.": "容器将在节点上使用的内存。",
    "millicores": "微核",
    "min pods, which is": "最小容器组，是",
    "min: {{hpa[0].spec.minReplicas || 1}},": "最小：{{hpa [0] .spec.minReplicas || 1}}，",
    "namespace. An image or template is required to add content.": "命名空间。添加内容需要映像或模板。",
    "no longer exists.": "不再存在",
    "no revision information,": "没有修订信息，",
    "node's default": "节点的默认值",
    "none": "无",
    "not started": "没有开始",
    "o deployments for {{row.apiObject.kind | humanizeKind}}": "o部署 {{row.apiObject.kind | humanizeKind}}",
    "of a CPU&nbsp;core.": "一个CPU核心。",
    "one of the images referenced by this deployment config changes.": "此部署配置引用的其中一个映像更改。",
    "openshift": "NeokylinKube",
    "or": "或",
    "or contain": "或包含",
    "other": "其他",
    "others": "其他",
    "password": "密码",
    "path elements.": "路径元素。",
    "persistent volume claim": "持久化卷定义",
    "pod": "容器组",
    "read-only": "只读的",
    "read-write": "读- 写",
    "reload": "重新加载",
    "replica": "副本",
    "replica count and selector": "副本计数和选择器",
    "repository to an OpenShift-visible git account and": "仓库到NeokylinKube可见的git帐户和",
    "request": "请求",
    "request.": "请求。",
    "routes": "路由",
    "running for": "用于运行",
    "runs as the": "运行以",
    "seconds": "秒",
    "seconds.": "秒。",
    "secret": "秘钥",
    "secret {{entry.secretRef.name}}.": "秘钥 {{entry.secretRef.name}}。",
    "select specific containers": "选择特定的容器",
    "services": "服务",
    "services in your project to expose with a route.": "项目中的服务以路由公开。",
    "set. Autoscaling will not work without a CPU": "设置。如果没有 cpu, 自动扩展将无法正常工作",
    "source repository": "源仓库",
    "started": "已开始",
    "tab, or run the following command:": "选项卡，或运行以下命令：",
    "the log to see new messages.": "日志以查看新消息。",
    "this route to enable secure network traffic.": "此路由可启用安全网络流量。",
    "to": "到",
    "to 0 replicas? This will stop all pods for the {{type}}.": "到0个副本？这将停止 {{type}} 的所有容器组。",
    "to ensure your application is running correctly.": "确保您的应用程序正常运行。",
    "to point to your fork.": "指向你的分叉。",
    "to see what stages will run.": "看看会运行哪些阶段。",
    "to volume": "到卷",
    "to {{build.status.completionTimestamp  | date : 'medium'}}": "到 {{build.status.completionTimestamp  | date : 'medium'}}",
    "unknown": "未知",
    "user which might not be permitted by your cluster administrator.": "您的群集管理员可能不允许的用户。",
    "username": "用戶名",
    "using persistent volumes": "使用持久卷",
    "using storage class {{pvc | storageClass}}": "使用存储类{{pvc | storageClass}}",
    "using the following payload URL and specifying a": "使用以下有效内容URL并指定",
    "waited for": "等待",
    "waiting for": "正在等待",
    "waiting for allocation,": "等待分配,",
    "waiting for {{pvc.spec.resources.requests['storage'] | usageWithUnits: 'storage'}} allocation,": "正在等待 {{pvc.spec.resources.requests['storage'] | usageWithUnits: 'storage'}}分配，",
    "warning": "警告",
    "warnings": "警告",
    "was cancelled": "被取消了",
    "was cancelled.": "被取消了。",
    "webhook trigger": "webhook触发器",
    "were generated automatically.": "是自动生成的。",
    "will be built and deployed unless otherwise specified in the next step.": "除非在下一步中另有说明，否则将构建和部署。",
    "will be used.": "将会被使用。",
    "will need image pull authority to deploy images from": "将需要映像拉取权限来部署映像",
    "with routers that support wildcard subdomains.": "使用支持通配符子域的路由器。",
    "with your image registry credentials and try again.": "使用您的映像仓库证书, 然后重试。",
    "with your image registry credentials.": "使用您的映像仓库证书。",
    "{env.valueFrom.configMapKeyRef.key}} in config map": "配置映射中的{env.valueFrom.configMapKeyRef.key}}",
    "{{$ctrl.overlayPaneEntryDetails.kind | humanizeKind : true}} Details": "{{$ ctrl.overlayPaneEntryDetails.kind | humanizeKind：true}}详情",
    "{{$ctrl.showSecret ? \"Hide\" : \"Reveal\"}} Secret": "{{$ctrl.showSecret ? \"隐藏\" : \"显示\"}} Secret",
    "{{$select.selected | upperFirst}} Secret": "{{$select.selected | upperFirst}} Secret秘钥",
    "{{(weightByService[service.metadata.name] / totalWeight) | percent}}": "{{(weightByService[service.metadata.name] / totalWeight) | percent}}",
    "{{container.resources.limits.cpu | usageWithUnits: 'cpu'}} limit": "{{container.resources.limits.cpu | usageWithUnits: 'cpu'}} 限制",
    "{{container.resources.limits.memory | usageWithUnits: 'memory'}} limit": "{{container.resources.limits.memory | usageWithUnits: 'memory'}} 限制",
    "{{container.resources.requests.cpu | usageWithUnits: 'cpu'}} requested": "{{container.resources.requests.cpu | usageWithUnits: 'cpu'}} 请求的",
    "{{container.resources.requests.cpu | usageWithUnits: 'cpu'}} to {{container.resources.limits.cpu | usageWithUnits: 'cpu'}}": "{{container.resources.requests.cpu | usageWithUnits: 'cpu'}} 到 {{container.resources.limits.cpu | usageWithUnits: 'cpu'}}",
    "{{container.resources.requests.memory | usageWithUnits: 'memory'}} requested": "{{container.resources.requests.memory | usageWithUnits: 'memory'}} 请求的",
    "{{container.resources.requests.memory | usageWithUnits: 'memory'}} to {{container.resources.limits.memory | usageWithUnits: 'memory'}}": "{{container.resources.requests.memory | usageWithUnits: 'memory'}} 到 {{container.resources.limits.memory | usageWithUnits: 'memory'}}",
    "{{customNameHeader || 'Name'}}": "{{customNameHeader || 'Name'}}",
    "{{customNameHeader || 'Route'}}": "{{customNameHeader || 'Route'}}",
    "{{deployment.metadata.name}} is paused.": "{{deployment.metadata.name}} 被暂停。",
    "{{deployment.status.availableReplicas}} available": "{{deployment.status.availableReplicas}} 可用",
    "{{deployment.status.unavailableReplicas}} unavailable": "{{deployment.status.unavailableReplicas}} 不可用",
    "{{displayName ? displayName : resourceName}} and its data will no longer be available to your applications.": "{{displayName ? displayName : resourceName}}及其数据将不再适用于您的应用程序。",
    "{{displayType | startCase}} Secret": "{{displayType | startCase}}秘钥",
    "{{emptyMessage || 'No pods to show'}}": "{{emptyMessage || '没有容器组可显示'}}",
    "{{env.name}} set to key": "{{env. name}} 设置为键",
    "{{env.valueFrom.secretKeyRef.key}} in secret": "{{env.valueFrom.secretKeyRef.key}}秘钥",
    "{{event.count}} times in the last": "最后的{{event.count}}次",
    "{{hpaList.length}} associated Horizontal Pod Autoscalers": "{{hpalist. 长度} 关联的水平容器组自动扩展器",
    "{{limits.min | usageWithUnits : 'storage'}} min to {{limits.max | usageWithUnits : 'storage'}} max": "最小值{{limits.min | usageWithUnits : 'storage'}}到最大值 {{limits.max | usageWithUnits : 'storage'}}",
    "{{notification.event.count}} times in the last": "最后{{notification.event.count}} 次",
    "{{notificationGroup.totalUnread}} Unread": "{{notificationGroup.totalUnread}}未读",
    "{{parameter.displayName || parameter.name}} is required.": "{{parameter.displayName || parameter.name}}是必需的。",
    "{{parameter.name}} is required.": "{{parameter.name}}是必需的。",
    "{{pod | numContainersReady}}/{{pod.spec.containers.length}} ready": "{{pod | numContainersReady}} / {{pod.spec.containers.length}}准备就绪",
    "{{probe.initialDelaySeconds}}s delay,": "{{probe.initialDelaySeconds}}延迟，",
    "{{probe.timeoutSeconds || 1}}s timeout": "{{probe.timeoutSeconds || 1}}超时",
    "{{row.apiObject.spec.strategy.type}} deployment is {{row.current | deploymentStatus | lowercase}}": "{{row.apiObject.spec.strategy.type}}部署是{{row.current | deploymentStatus | lowercase}}",
    "{{showDCEnvs ? 'Hide' : 'Show'}} Image Environment Variables": "显示映像环境变量{{showDCEnvs ? 'Hide' : 'Show'}}",
    "{{spec}} replica": "{{spec}} 副本",
    "{{status}} current / {{spec}} desired": "当前 {{status}} / 需要 {{spec}}",
    "{{type | upperFirst}} Hook": "{{type | upperFirst}} 钩子",
    "{{type | upperFirst}} Secret": "{{type | upperFirst}}秘钥",
    "{{typeDisplayName || (kind | humanizeKind)}} to delete": "{{typeDisplayName || （kind | humanizeKind）}}删除",
    "{{updateTemplate ? \"This will overwrite the current version of the template.\" : \"Save the template to the project. This will make the template available to anyone who can view the project.\"}}": "{{updateTemplate？ “这将覆盖当前版本的模板。” ：“将模板保存到项目中。这将使模板可供任何可以查看项目的人使用。”}}",
    "{{updateTemplate ? \"Update\" : \"Add\"}} Template": "{{updateTemplate？ “更新”：“添加”}}模板",
    "{{updateTemplate ? \"Update\" : \"Save\"}} template": "{{updateTemplate？ “更新”：“保存”}}模板",
    "Applications": "应用",
    "Business Process Services": "业务流程服务",
    "Catalog": "目录",
    "Continuous Integration & Deployment": "持续集成和部署",
    "Data Stores": "数据仓库",
    "Integration": "集成",
    "Languages": "语言",
    "Messaging": "消息",
    "Monitoring": "监控",
    "Overview": "概述",
    "Resources": "资源",
    "Single Sign-On": "单点登录",
    "Technologies": "技术",
    "Uncategorized": "未分类",
    "Select an item to add to the current project": "选择要添加到当前项目的项"

    });
/* jshint +W100 */
}]);

pluginLoader.addModule('openshiftConsole');
