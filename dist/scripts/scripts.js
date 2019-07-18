"use strict";

function OverviewController(e, t, n, a, r, o, i, s, c, l, u, d, m, p, g, f, h, v, y, b, S, C, w, P, k, j, R, I, T, N, A) {
function E(e) {
var t = e.metadata.ownerReferences;
return t ? _(t).filter({
kind: "OfflineVirtualMachine"
}).map("uid").first() : null;
}
function D() {
if (B.offlineVirtualMachines && B.virtualMachines && B.pods) {
var e = _(B.pods).values().filter(function(e) {
return !!_.get(e, 'metadata.labels["kubevirt.io/vmUID"]');
}).keyBy('metadata.labels["kubevirt.io/vmUID"]').value(), t = _(B.virtualMachines).values().filter(function(e) {
return !!E(e);
}).keyBy(function(e) {
return E(e);
}).value(), n = [];
_.each(B.offlineVirtualMachines, function(a) {
var r = a.metadata.uid, o = t[r];
if (o) {
a._vm = o;
var i = e[o.metadata.uid];
i && (a._pod = i, n.push(i));
}
}), B.monopods && (B.monopods = _(B.monopods).filter(function(e) {
return !_.includes(n, e);
}).keyBy("metadata.name").value());
}
}
var B = this, L = t("isIE")();
e.projectName = r.project;
var V = r.isHomePage;
B.catalogLandingPageEnabled = !d.DISABLE_SERVICE_CATALOG_LANDING_PAGE;
var U = t("annotation"), O = t("canI"), F = t("buildConfigForBuild"), x = t("deploymentIsInProgress"), M = t("imageObjectRef"), q = t("isJenkinsPipelineStrategy"), z = t("isNewerResource"), H = t("label"), K = t("podTemplate"), W = i.getPreferredVersion("buildconfigs"), G = i.getPreferredVersion("builds"), J = i.getPreferredVersion("appliedclusterresourcequotas"), Y = i.getPreferredVersion("daemonsets"), Q = i.getPreferredVersion("deploymentconfigs"), Z = i.getPreferredVersion("deployments"), X = i.getPreferredVersion("horizontalpodautoscalers"), ee = i.getPreferredVersion("imagestreams"), te = i.getPreferredVersion("limitranges"), ne = i.getPreferredVersion("pods"), ae = i.getPreferredVersion("replicasets"), re = i.getPreferredVersion("replicationcontrollers"), oe = i.getPreferredVersion("resourcequotas"), ie = i.getPreferredVersion("routes"), se = i.getPreferredVersion("servicebindings"), ce = i.getPreferredVersion("clusterserviceclasses"), le = i.getPreferredVersion("serviceinstances"), ue = i.getPreferredVersion("clusterserviceplans"), de = i.getPreferredVersion("services"), me = i.getPreferredVersion("statefulsets"), pe = i.getPreferredVersion("templates");
B.buildConfigsInstantiateVersion = i.getPreferredVersion("buildconfigs/instantiate");
var ge, fe, he = {}, ve = {}, ye = {}, be = B.state = {
alerts: {},
builds: {},
clusterQuotas: {},
imageStreamImageRefByDockerReference: {},
imagesByDockerReference: {},
limitRanges: {},
limitWatches: L,
notificationsByObjectUID: {},
pipelinesByDeploymentConfig: {},
podsByOwnerUID: {},
quotas: {},
recentPipelinesByDeploymentConfig: {},
routesByService: {},
servicesByObjectUID: {},
serviceInstances: {},
serviceClasses: {},
servicePlans: {},
bindingsByInstanceRef: {},
bindingsByApplicationUID: {},
applicationsByBinding: {},
showMetrics: !1
};
B.state.breakpoint = h.getBreakpoint();
var Se = _.throttle(function() {
var t = h.getBreakpoint();
B.state.breakpoint !== t && e.$evalAsync(function() {
B.state.breakpoint = t;
});
}, 50);
$(window).on("resize.overview", Se), B.showGetStarted = !1, B.showLoading = !0, B.filterByOptions = [ {
id: "name",
label: "Name"
}, {
id: "label",
label: "Label"
} ], B.filterBy = b.getLabelSelector().isEmpty() ? "name" : "label", B.viewByOptions = [ {
id: "app",
label: "Application"
}, {
id: "resource",
label: "Resource Type"
}, {
id: "pipeline",
label: "Pipeline"
} ];
var Ce = function(e) {
return _.get(e, "metadata.name");
}, we = function(e) {
return _.get(e, "metadata.uid");
}, _e = function() {
return _.size(B.deploymentConfigs) + _.size(B.vanillaReplicationControllers) + _.size(B.deployments) + _.size(B.vanillaReplicaSets) + _.size(B.statefulSets) + _.size(B.daemonSets) + _.size(B.monopods) + _.size(B.state.serviceInstances) + _.size(B.mobileClients) + _.size(B.offlineVirtualMachines);
}, Pe = function() {
return _.size(B.filteredDeploymentConfigs) + _.size(B.filteredReplicationControllers) + _.size(B.filteredDeployments) + _.size(B.filteredReplicaSets) + _.size(B.filteredStatefulSets) + _.size(B.filteredDaemonSets) + _.size(B.filteredMonopods) + _.size(B.filteredServiceInstances) + _.size(B.filteredMobileClients) + _.size(B.filteredOfflineVirtualMachines);
}, ke = function() {
B.size = _e(), B.filteredSize = Pe();
var e = 0 === B.size, t = B.deploymentConfigs && B.replicationControllers && B.deployments && B.replicaSets && B.statefulSets && B.daemonSets && B.pods && B.state.serviceInstances;
be.expandAll = t && 1 === B.size, B.showGetStarted = t && e, B.showLoading = !t && e, B.everythingFiltered = !e && !B.filteredSize, B.hidePipelineOtherResources = "pipeline" === B.viewBy && (B.filterActive || _.isEmpty(B.pipelineBuildConfigs));
}, je = function(e) {
return s.groupByApp(e, "metadata.name");
}, Re = function(e) {
var t = [], n = null;
return _.each(e, function(e) {
T.isOverviewAppRoute(e) ? t.push(e) : n = n ? T.getPreferredDisplayRoute(n, e) : e;
}), !t.length && n && t.push(n), T.sortRoutesByScore(t);
}, Ie = _.debounce(function() {
e.$evalAsync(function() {
if (B.routesToDisplayByApp = {}, B.routes) {
var e = [ B.filteredDeploymentConfigsByApp, B.filteredReplicationControllersByApp, B.filteredDeploymentsByApp, B.filteredReplicaSetsByApp, B.filteredStatefulSetsByApp, B.filteredDaemonSetsByApp, B.filteredMonopodsByApp ];
_.each(B.apps, function(t) {
var n = {};
_.each(e, function(e) {
var a = _.get(e, t, []);
_.each(a, function(e) {
var t = we(e), a = _.get(be, [ "servicesByObjectUID", t ], []);
_.each(a, function(e) {
var t = _.get(be, [ "routesByService", e.metadata.name ], []);
_.assign(n, _.keyBy(t, "metadata.name"));
});
});
}), B.routesToDisplayByApp[t] = Re(n);
});
}
});
}, 300, {
maxWait: 1500
}), Te = function() {
B.filteredDeploymentConfigsByApp = je(B.filteredDeploymentConfigs), B.filteredReplicationControllersByApp = je(B.filteredReplicationControllers), B.filteredDeploymentsByApp = je(B.filteredDeployments), B.filteredReplicaSetsByApp = je(B.filteredReplicaSets), B.filteredStatefulSetsByApp = je(B.filteredStatefulSets), B.filteredDaemonSetsByApp = je(B.filteredDaemonSets), B.filteredMonopodsByApp = je(B.filteredMonopods), B.apps = _.union(_.keys(B.filteredDeploymentConfigsByApp), _.keys(B.filteredReplicationControllersByApp), _.keys(B.filteredDeploymentsByApp), _.keys(B.filteredReplicaSetsByApp), _.keys(B.filteredStatefulSetsByApp), _.keys(B.filteredDaemonSetsByApp), _.keys(B.filteredMonopodsByApp)), s.sortAppNames(B.apps), Ie();
}, Ne = function() {
var e = _.filter(B.deploymentConfigs, function(e) {
var t = Ce(e);
return _.isEmpty(be.pipelinesByDeploymentConfig[t]);
});
B.deploymentConfigsNoPipeline = _.sortBy(e, "metadata.name"), B.pipelineViewHasOtherResources = !(_.isEmpty(B.deploymentConfigsNoPipeline) && _.isEmpty(B.vanillaReplicationControllers) && _.isEmpty(B.deployments) && _.isEmpty(B.vanillaReplicaSets) && _.isEmpty(B.statefulSets) && _.isEmpty(B.monopods));
}, Ae = function() {
B.disableFilter = "pipeline" === B.viewBy && _.isEmpty(B.pipelineBuildConfigs);
}, Ee = function(e) {
return b.getLabelSelector().select(e);
}, De = [ "metadata.name", "spec.clusterServiceClassExternalName" ], $e = function(e) {
return y.filterForKeywords(e, De, be.filterKeywords);
}, Be = function(e) {
switch (B.filterBy) {
case "label":
return Ee(e);

case "name":
return $e(e);
}
return e;
}, Le = function() {
switch (B.filterBy) {
case "label":
return !b.getLabelSelector().isEmpty();

case "name":
return !_.isEmpty(be.filterKeywords);
}
}, Ve = function() {
B.filteredDeploymentConfigs = Be(B.deploymentConfigs), B.filteredReplicationControllers = Be(B.vanillaReplicationControllers), B.filteredDeployments = Be(B.deployments), B.filteredReplicaSets = Be(B.vanillaReplicaSets), B.filteredStatefulSets = Be(B.statefulSets), B.filteredDaemonSets = Be(B.daemonSets), B.filteredMonopods = Be(B.monopods), B.filteredPipelineBuildConfigs = Be(B.pipelineBuildConfigs), B.filteredServiceInstances = Be(be.orderedServiceInstances), B.filteredMobileClients = Be(B.mobileClients), B.filteredOfflineVirtualMachines = Be(B.offlineVirtualMachines), B.filterActive = Le(), Te(), ke();
}, Ue = r.project + "/overview/view-by";
B.viewBy = localStorage.getItem(Ue) || "app", e.$watch(function() {
return B.viewBy;
}, function(e) {
localStorage.setItem(Ue, e), Ae(), De = "app" === B.viewBy ? [ "metadata.name", "metadata.labels.app" ] : [ "metadata.name" ], Ve(), "pipeline" === B.viewBy ? b.setLabelSuggestions(ve) : b.setLabelSuggestions(he);
}), d.DISABLE_OVERVIEW_METRICS || (C.isAvailable(!0).then(function(e) {
be.showMetrics = e;
}), e.$on("metrics-connection-failed", function(e, t) {
o.isAlertPermanentlyHidden("metrics-connection-failed") || be.alerts["metrics-connection-failed"] || (be.alerts["metrics-connection-failed"] = {
type: "warning",
message: "An error occurred getting metrics.",
links: [ {
href: t.url,
label: "Open Metrics URL",
target: "_blank"
}, {
href: "",
label: "Don't Show Me Again",
onClick: function() {
return o.permanentlyHideAlert("metrics-connection-failed"), !0;
}
} ]
});
}));
var Oe = function(e) {
return e && "Pod" === e.kind;
}, Fe = function(e) {
var t = we(e);
return t ? Oe(e) ? [ e ] : _.get(B, [ "state", "podsByOwnerUID", t ], []) : [];
}, xe = function(e, t) {
var n = we(e);
be.notificationsByObjectUID[n] = t || {};
}, Me = function(e) {
var t = we(e);
return t ? _.get(be, [ "notificationsByObjectUID", t ], {}) : {};
}, qe = function(e) {
if (we(e)) {
var t = Fe(e), n = I.getPodAlerts(t, r.project);
xe(e, n);
}
}, ze = function(e) {
_.each(e, qe);
}, He = function(e) {
var t = Ce(e);
return t ? ye[t] : null;
}, Ke = function(e) {
var t = Ce(e);
return t ? _.get(B, [ "replicationControllersByDeploymentConfig", t ]) : [];
};
B.getPreviousReplicationController = function(e) {
var t = Ke(e);
return _.size(t) < 2 ? null : t[1];
};
var We = function(e) {
var t = {}, n = He(e);
_.assign(t, I.getDeploymentStatusAlerts(e, n), I.getPausedDeploymentAlerts(e));
var a = Ke(e);
_.each(a, function(e) {
var n = Me(e);
_.assign(t, n);
}), xe(e, t);
}, Ge = function() {
_.each(B.deploymentConfigs, We);
}, Je = function(e) {
var t = we(e);
return t ? _.get(B, [ "replicaSetsByDeploymentUID", t ]) : {};
}, Ye = function(e) {
var t = I.getPausedDeploymentAlerts(e), n = Je(e);
_.each(n, function(e) {
var n = Me(e);
_.assign(t, n);
}), xe(e, t);
}, Qe = function() {
_.each(B.deployments, Ye);
}, Ze = function() {
ze(B.replicationControllers), ze(B.replicaSets), ze(B.statefulSets), ze(B.daemonSets), ze(B.monopods);
}, Xe = _.debounce(function() {
e.$evalAsync(function() {
Ze(), Ge(), Qe();
});
}, 500), et = function(e) {
_.isEmpty(e) || (b.addLabelSuggestionsFromResources(e, he), "pipeline" !== B.viewBy && b.setLabelSuggestions(he));
}, tt = function(e) {
_.isEmpty(e) || (b.addLabelSuggestionsFromResources(e, ve), "pipeline" === B.viewBy && b.setLabelSuggestions(ve));
}, nt = function(e) {
return "Succeeded" !== e.status.phase && "Failed" !== e.status.phase && (!H(e, "openshift.io/deployer-pod-for.name") && (!U(e, "openshift.io/build.name") && "slave" !== H(e, "jenkins")));
}, at = function() {
be.podsByOwnerUID = k.groupByOwnerUID(B.pods), B.monopods = _.filter(be.podsByOwnerUID[""], nt), D();
}, rt = function(e) {
return !!_.get(e, "status.replicas") || (!U(e, "deploymentConfig") || x(e));
}, ot = function(e) {
return U(e, "deploymentConfig");
}, it = function() {
if (B.deploymentConfigs && B.replicationControllers) {
var e = [];
B.replicationControllersByDeploymentConfig = {}, B.currentByDeploymentConfig = {}, ye = {};
var t = {}, n = {};
_.each(B.replicationControllers, function(a) {
var r = ot(a) || "";
(!r || !B.deploymentConfigs[r] && _.get(a, "status.replicas")) && e.push(a);
var o = ye[r];
o && !z(a, o) || (ye[r] = a);
var i;
"Complete" === U(a, "deploymentStatus") && ((i = t[r]) && !z(a, i) || (t[r] = a)), rt(a) && _.set(n, [ r, a.metadata.name ], a);
}), _.each(t, function(e, t) {
_.set(n, [ t, e.metadata.name ], e);
}), _.each(n, function(e, t) {
var n = p.sortByDeploymentVersion(e, !0);
B.replicationControllersByDeploymentConfig[t] = n, B.currentByDeploymentConfig[t] = _.head(n);
}), B.vanillaReplicationControllers = _.sortBy(e, "metadata.name"), Ge();
}
}, st = function(e, t) {
if (_.get(e, "status.replicas")) return !0;
var n = p.getRevision(e);
return !n || !!t && p.getRevision(t) === n;
}, ct = function() {
B.replicaSets && ge && (B.replicaSetsByDeploymentUID = P.groupByControllerUID(B.replicaSets), B.currentByDeploymentUID = {}, _.each(B.replicaSetsByDeploymentUID, function(e, t) {
if (t) {
var n = ge[t], a = _.filter(e, function(e) {
return st(e, n);
}), r = p.sortByRevision(a);
B.replicaSetsByDeploymentUID[t] = r, B.currentByDeploymentUID[t] = _.head(r);
}
}), B.vanillaReplicaSets = _.sortBy(B.replicaSetsByDeploymentUID[""], "metadata.name"), Qe());
}, lt = {}, ut = function(e) {
e && be.allServices && _.each(e, function(e) {
var t = [], n = we(e), a = K(e);
_.each(lt, function(e, n) {
e.matches(a) && t.push(be.allServices[n]);
}), be.servicesByObjectUID[n] = _.sortBy(t, "metadata.name");
});
}, dt = function() {
if (be.allServices) {
lt = _.mapValues(be.allServices, function(e) {
return new LabelSelector(e.spec.selector);
});
var e = [ B.deploymentConfigs, B.vanillaReplicationControllers, B.deployments, B.vanillaReplicaSets, B.statefulSets, B.daemonSets, B.monopods ];
_.each(e, ut), Ie();
}
}, mt = function() {
var e = T.groupByService(B.routes, !0);
be.routesByService = _.mapValues(e, T.sortRoutesByScore), Ie();
}, pt = function() {
be.hpaByResource = f.groupHPAs(B.horizontalPodAutoscalers);
}, gt = function(e) {
var t = F(e), n = B.buildConfigs[t];
if (n) {
B.recentPipelinesByBuildConfig[t] = B.recentPipelinesByBuildConfig[t] || [], B.recentPipelinesByBuildConfig[t].push(e);
var a = l.usesDeploymentConfigs(n);
_.each(a, function(t) {
be.recentPipelinesByDeploymentConfig[t] = be.recentPipelinesByDeploymentConfig[t] || [], be.recentPipelinesByDeploymentConfig[t].push(e);
}), Ne();
}
}, ft = {}, ht = function() {
ft = l.groupBuildConfigsByOutputImage(B.buildConfigs);
}, vt = function(e) {
var t = we(e);
if (t) return _.get(be, [ "buildConfigsByObjectUID", t ], []);
}, yt = function(e) {
var t = [], n = vt(e);
_.each(n, function(e) {
var n = _.get(be, [ "recentBuildsByBuildConfig", e.metadata.name ], []);
t = t.concat(n);
});
var a = Ce(e);
_.set(be, [ "recentBuildsByDeploymentConfig", a ], t);
}, bt = function(e, t) {
var n = we(t);
n && _.set(be, [ "buildConfigsByObjectUID", n ], e);
}, St = function() {
var e = [];
B.deploymentConfigsByPipeline = {}, be.pipelinesByDeploymentConfig = {}, _.each(B.buildConfigs, function(t) {
if (q(t)) {
e.push(t);
var n = l.usesDeploymentConfigs(t), a = Ce(t);
_.set(B, [ "deploymentConfigsByPipeline", a ], n), _.each(n, function(e) {
be.pipelinesByDeploymentConfig[e] = be.pipelinesByDeploymentConfig[e] || [], be.pipelinesByDeploymentConfig[e].push(t);
});
}
}), B.pipelineBuildConfigs = _.sortBy(e, "metadata.name"), Ne(), tt(B.pipelineBuildConfigs), Ae();
}, Ct = function() {
be.buildConfigsByObjectUID = {}, _.each(B.deploymentConfigs, function(e) {
var t = [], n = _.get(e, "spec.triggers");
_.each(n, function(n) {
var a = _.get(n, "imageChangeParams.from");
if (a) {
var r = M(a, e.metadata.namespace), o = ft[r];
_.isEmpty(o) || (t = t.concat(o));
}
}), t = _.sortBy(t, "metadata.name"), bt(t, e), yt(e);
});
}, wt = function() {
St(), Ct();
}, _t = function() {
_.each(B.deploymentConfigs, yt);
}, Pt = function() {
if (be.builds && B.buildConfigs) {
B.recentPipelinesByBuildConfig = {}, be.recentBuildsByBuildConfig = {}, be.recentPipelinesByDeploymentConfig = {};
var e = {};
_.each(l.interestingBuilds(be.builds), function(t) {
var n = F(t);
q(t) ? gt(t) : (e[n] = e[n] || [], e[n].push(t));
}), B.recentPipelinesByBuildConfig = _.mapValues(B.recentPipelinesByBuildConfig, function(e) {
return l.sortBuilds(e, !0);
}), be.recentPipelinesByDeploymentConfig = _.mapValues(be.recentPipelinesByDeploymentConfig, function(e) {
return l.sortBuilds(e, !0);
}), be.recentBuildsByBuildConfig = _.mapValues(e, function(e) {
return l.sortBuilds(e, !0);
}), _t();
}
}, kt = function() {
I.setQuotaNotifications(be.quotas, be.clusterQuotas, r.project);
};
B.clearFilter = function() {
b.clear(), B.filterText = "";
}, e.$watch(function() {
return B.filterText;
}, _.debounce(function(t, n) {
t !== n && (be.filterKeywords = y.generateKeywords(t), e.$evalAsync(Ve));
}, 50, {
maxWait: 250
})), e.$watch(function() {
return B.filterBy;
}, function(e, t) {
e !== t && (B.clearFilter(), Ve());
}), e.browseCatalog = function() {
w.toProjectCatalog(e.projectName);
}, b.onActiveFiltersChanged(function() {
e.$evalAsync(Ve);
}), B.startBuild = l.startBuild;
var jt = function() {
if (be.bindingsByApplicationUID = {}, be.applicationsByBinding = {}, be.deleteableBindingsByApplicationUID = {}, !_.isEmpty(be.bindings)) {
var e = [ B.deployments, B.deploymentConfigs, B.vanillaReplicationControllers, B.vanillaReplicaSets, B.statefulSets, B.daemonSets ];
if (!_.some(e, function(e) {
return !e;
})) {
var t = c.getPodPresetSelectorsForBindings(be.bindings);
_.each(e, function(e) {
_.each(e, function(e) {
var n = we(e), a = new LabelSelector(_.get(e, "spec.selector"));
be.bindingsByApplicationUID[n] = [], be.deleteableBindingsByApplicationUID[n] = [], _.each(t, function(t, r) {
t.covers(a) && (be.bindingsByApplicationUID[n].push(be.bindings[r]), _.get(be.bindings[r], "metadata.deletionTimestamp") || be.deleteableBindingsByApplicationUID[n].push(be.bindings[r]), be.applicationsByBinding[r] = be.applicationsByBinding[r] || [], be.applicationsByBinding[r].push(e));
});
});
}), B.bindingsByInstanceRef = _.reduce(B.bindingsByInstanceRef, function(e, t, n) {
return e[n] = _.sortBy(t, function(e) {
var t = _.get(be.applicationsByBinding, [ e.metadata.name ]);
return _.get(_.head(t), [ "metadata", "name" ]) || e.metadata.name;
}), e;
}, {});
}
}
}, Rt = function() {
be.bindableServiceInstances = c.filterBindableServiceInstances(be.serviceInstances, be.serviceClasses, be.servicePlans), be.orderedServiceInstances = c.sortServiceInstances(be.serviceInstances, be.serviceClasses);
}, It = [], Tt = V ? {
skipErrorNotFound: !0
} : {};
j.get(r.project, Tt).then(_.spread(function(t, a) {
be.project = e.project = t, be.context = e.context = a;
var r = function() {
B.pods && v.fetchReferencedImageStreamImages(B.pods, be.imagesByDockerReference, be.imageStreamImageRefByDockerReference, a);
}, o = function(e) {
B.daemonSets = e.by("metadata.name"), ut(B.daemonSetData), ut(B.monopods), ze(B.daemonSets), et(B.daemonSets), jt(), Ve(), S.log("daemonsets", B.daemonSets);
}, i = !1, s = function() {
i || (It.push(m.watch(Y, a, o, {
poll: L,
pollInterval: 6e4
})), i = !0);
}, c = function(e) {
var t = P.getOwnerReferences(e);
return _.some(t, {
controller: !0,
kind: "DaemonSet"
});
}, l = function() {
i || _.some(B.pods, c) && s();
};
if (It.push(m.watch(ne, a, function(e, t) {
B.pods = e.by("metadata.name"), at(), r(), Xe(), ut(B.monopods), ze(B.monopods), et(B.monopods), Ve(), t && "ADDED" !== t || l(), S.log("pods (subscribe)", B.pods);
})), It.push(m.watch(re, a, function(e) {
B.replicationControllers = e.by("metadata.name"), it(), ut(B.vanillaReplicationControllers), ut(B.monopods), ze(B.vanillaReplicationControllers), et(B.vanillaReplicationControllers), jt(), Ve(), S.log("replicationcontrollers (subscribe)", B.replicationControllers);
})), It.push(m.watch(Q, a, function(e) {
B.deploymentConfigs = e.by("metadata.name"), it(), ut(B.deploymentConfigs), ut(B.vanillaReplicationControllers), et(B.deploymentConfigs), Qe(), wt(), _t(), jt(), Ve(), S.log("deploymentconfigs (subscribe)", B.deploymentConfigs);
})), It.push(m.watch(ae, a, function(e) {
B.replicaSets = e.by("metadata.name"), ct(), ut(B.vanillaReplicaSets), ut(B.monopods), ze(B.vanillaReplicaSets), et(B.vanillaReplicaSets), jt(), Ve(), S.log("replicasets (subscribe)", B.replicaSets);
})), It.push(m.watch(Z, a, function(e) {
ge = e.by("metadata.uid"), B.deployments = _.sortBy(ge, "metadata.name"), ct(), ut(B.deployments), ut(B.vanillaReplicaSets), et(B.deployments), jt(), Ve(), S.log("deployments (subscribe)", B.deploymentsByUID);
})), It.push(m.watch(G, a, function(e) {
be.builds = e.by("metadata.name"), Pt(), S.log("builds (subscribe)", be.builds);
})), It.push(m.watch(me, a, function(e) {
B.statefulSets = e.by("metadata.name"), ut(B.statefulSets), ut(B.monopods), ze(B.statefulSets), et(B.statefulSets), jt(), Ve(), S.log("statefulsets (subscribe)", B.statefulSets);
}, {
poll: L,
pollInterval: 6e4
})), m.list(Y, a, function(e) {
o(e), _.isEmpty(B.daemonSets) || s();
}), It.push(m.watch(de, a, function(e) {
be.allServices = e.by("metadata.name"), dt(), S.log("services (subscribe)", be.allServices);
}, {
poll: L,
pollInterval: 6e4
})), It.push(m.watch(ie, a, function(e) {
B.routes = e.by("metadata.name"), mt(), S.log("routes (subscribe)", B.routes);
}, {
poll: L,
pollInterval: 6e4
})), It.push(m.watch(W, a, function(e) {
B.buildConfigs = e.by("metadata.name"), ht(), wt(), Pt(), Ve(), S.log("buildconfigs (subscribe)", B.buildConfigs);
}, {
poll: L,
pollInterval: 6e4
})), It.push(m.watch(X, a, function(e) {
B.horizontalPodAutoscalers = e.by("metadata.name"), pt(), S.log("autoscalers (subscribe)", B.horizontalPodAutoscalers);
}, {
poll: L,
pollInterval: 6e4
})), It.push(m.watch(ee, a, function(e) {
fe = e.by("metadata.name"), v.buildDockerRefMapForImageStreams(fe, be.imageStreamImageRefByDockerReference), r(), S.log("imagestreams (subscribe)", fe);
}, {
poll: L,
pollInterval: 6e4
})), It.push(m.watch(oe, a, function(e) {
be.quotas = e.by("metadata.name"), kt();
}, {
poll: !0,
pollInterval: 6e4
})), It.push(m.watch(J, a, function(e) {
be.clusterQuotas = e.by("metadata.name"), kt();
}, {
poll: !0,
pollInterval: 6e4
})), e.AEROGEAR_MOBILE_ENABLED && It.push(m.watch({
group: "mobile.k8s.io",
version: "v1alpha1",
resource: "mobileclients"
}, a, function(e) {
B.mobileClients = e.by("metadata.name"), Ve(), S.log("mobileclients (subscribe)", e);
}, {
poll: L,
pollInterval: 6e4
})), e.KUBEVIRT_ENABLED) {
It.push(m.watch(A.offlineVirtualMachine, a, function(e) {
B.offlineVirtualMachines = e.by("metadata.name"), D(), Ve();
}, {
poll: L,
pollInterval: 6e4
}));
It.push(m.watch(A.virtualMachine, a, function(e) {
B.virtualMachines = e.by("metadata.name"), D(), Ve();
}, {
poll: L,
pollInterval: 6e4
}));
}
var p, g, f = {}, h = {};
u.SERVICE_CATALOG_ENABLED && O(le, "watch") && (p = function(e) {
var t = N.getServiceClassNameForInstance(e);
if (!t) return n.when();
var a = _.get(be, [ "serviceClasses", t ]);
return a ? n.when(a) : (f[t] || (f[t] = m.get(ce, t, {}).then(function(e) {
return be.serviceClasses[t] = e, e;
}).finally(function() {
delete h[t];
})), f[t]);
}, g = function(e) {
var t = N.getServicePlanNameForInstance(e);
if (!t) return n.when();
var a = _.get(be, [ "servicePlans", t ]);
return a ? n.when(a) : (h[t] || (h[t] = m.get(ue, t, {}).then(function(e) {
return be.servicePlans[t] = e, e;
}).finally(function() {
delete h[t];
})), h[t]);
}, It.push(m.watch(le, a, function(e) {
be.serviceInstances = e.by("metadata.name");
var t = [];
_.each(be.serviceInstances, function(e) {
var n = I.getServiceInstanceAlerts(e);
xe(e, n), t.push(p(e)), t.push(g(e));
}), R.waitForAll(t).finally(function() {
Rt(), Ve();
}), et(be.serviceInstances);
}, {
poll: L,
pollInterval: 6e4
}))), u.SERVICE_CATALOG_ENABLED && O(se, "watch") && It.push(m.watch(se, a, function(e) {
be.bindings = e.by("metadata.name"), B.bindingsByInstanceRef = _.groupBy(be.bindings, "spec.instanceRef.name"), jt();
}, {
poll: L,
pollInterval: 6e4
})), m.list(te, a, function(e) {
be.limitRanges = e.by("metadata.name");
});
var y = d.SAMPLE_PIPELINE_TEMPLATE;
y && m.get(pe, y.name, {
namespace: y.namespace
}, {
errorNotification: !1
}).then(function(t) {
B.samplePipelineURL = w.createFromTemplateURL(t, e.projectName);
}), e.$on("$destroy", function() {
m.unwatchAll(It), $(window).off(".overview");
});
}), function(t) {
V && _.get(t, "notFound") && (g.notifyInvalidProjectHomePage(e.projectName), w.toProjectList());
});
}

function ResourceServiceBindings(e, t, n, a, r) {
var o, i = this, s = e("enableTechPreviewFeature");
i.bindings = [], i.bindableServiceInstances = [], i.serviceClasses = [], i.serviceInstances = [], i.showBindings = a.SERVICE_CATALOG_ENABLED && s("pod_presets");
var c = e("isIE")(), l = [], u = e("canI"), d = i.serviceBindingsVersion = t.getPreferredVersion("servicebindings"), m = t.getPreferredVersion("clusterserviceclasses"), p = t.getPreferredVersion("serviceinstances"), g = t.getPreferredVersion("clusterserviceplans"), f = function() {
i.apiObject && i.bindings && (i.bindings = n.getBindingsForResource(i.bindings, i.apiObject));
}, h = function() {
i.bindableServiceInstances = n.filterBindableServiceInstances(i.serviceInstances, i.serviceClasses, o), i.orderedServiceInstances = n.sortServiceInstances(i.serviceInstances, i.serviceClasses);
};
i.createBinding = function() {
i.overlayPanelVisible = !0, i.overlayPanelName = "bindService";
}, i.closeOverlayPanel = function() {
i.overlayPanelVisible = !1;
};
var v = function() {
r.unwatchAll(l), l = [], a.SERVICE_CATALOG_ENABLED && u(d, "watch") && l.push(r.watch(d, i.projectContext, function(e) {
i.bindings = e.by("metadata.name"), f();
}, {
poll: c,
pollInterval: 6e4
})), a.SERVICE_CATALOG_ENABLED && u(p, "watch") && (l.push(r.watch(p, i.projectContext, function(e) {
i.serviceInstances = e.by("metadata.name"), h();
}, {
poll: c,
pollInterval: 6e4
})), r.list(m, {}, function(e) {
i.serviceClasses = e.by("metadata.name"), h();
}), r.list(g, {}, function(e) {
o = e.by("metadata.name");
}));
};
i.$onChanges = function(e) {
e.projectContext && i.showBindings && v();
}, i.$onDestroy = function() {
r.unwatchAll(l);
};
}

function ServiceInstanceBindings(e, t, n) {
var a = this, r = e("canI"), o = a.serviceBindingsVersion = t.getPreferredVersion("servicebindings"), i = function() {
a.bindable = r(o, "create") && n.isServiceBindable(a.serviceInstance, a.serviceClass, a.servicePlan);
};
a.createBinding = function() {
a.overlayPanelVisible = !0;
}, a.closeOverlayPanel = function() {
a.overlayPanelVisible = !1;
}, a.$onChanges = function() {
i();
};
}

angular.isUndefined(window.OPENSHIFT_CONSTANTS) && (window.OPENSHIFT_CONSTANTS = {}), angular.extend(window.OPENSHIFT_CONSTANTS, {
HELP_BASE_URL: "https://docs.openshift.org/latest/",
HELP: {
cli: "cli_reference/index.html",
get_started_cli: "cli_reference/get_started_cli.html",
basic_cli_operations: "cli_reference/basic_cli_operations.html",
"build-triggers": "dev_guide/builds/triggering_builds.html",
webhooks: "dev_guide/builds/triggering_builds.html#webhook-triggers",
new_app: "dev_guide/application_lifecycle/new_app.html",
"start-build": "dev_guide/builds/basic_build_operations.html#starting-a-build",
"deployment-operations": "cli_reference/basic_cli_operations.html#build-and-deployment-cli-operations",
"route-types": "architecture/networking/routes.html#route-types",
persistent_volumes: "dev_guide/persistent_volumes.html",
expanding_persistent_volumes: "dev_guide/expanding_persistent_volumes.html",
compute_resources: "dev_guide/compute_resources.html",
pod_autoscaling: "dev_guide/pod_autoscaling.html",
application_health: "dev_guide/application_health.html",
webhook_secrets: "dev_guide/builds/triggering_builds.html#webhook-triggers",
source_secrets: "dev_guide/builds/build_inputs.html#using-secrets-during-build",
git_secret: "dev_guide/builds/build_inputs.html#source-clone-secrets",
pull_secret: "dev_guide/managing_images.html#using-image-pull-secrets",
managing_secrets: "dev_guide/service_accounts.html#managing-allowed-secrets",
creating_secrets: "dev_guide/secrets.html#creating-secrets",
storage_classes: "install_config/persistent_storage/dynamically_provisioning_pvs.html",
selector_label: "install_config/persistent_storage/selector_label_binding.html",
rolling_strategy: "dev_guide/deployments/deployment_strategies.html#rolling-strategy",
recreate_strategy: "dev_guide/deployments/deployment_strategies.html#recreate-strategy",
custom_strategy: "dev_guide/deployments/deployment_strategies.html#custom-strategy",
lifecycle_hooks: "dev_guide/deployments/deployment_strategies.html#lifecycle-hooks",
new_pod_exec: "dev_guide/deployments/deployment_strategies.html#pod-based-lifecycle-hook",
authorization: "architecture/additional_concepts/authorization.html",
roles: "architecture/additional_concepts/authorization.html#roles",
service_accounts: "dev_guide/service_accounts.html",
users_and_groups: "architecture/additional_concepts/authentication.html#users-and-groups",
"pipeline-builds": "architecture/core_concepts/builds_and_image_streams.html#pipeline-build",
"pipeline-plugin": "using_images/other_images/jenkins.html#openshift-origin-pipeline-plug-in",
quota: "dev_guide/compute_resources.html",
"config-maps": "dev_guide/configmaps.html",
secrets: "dev_guide/secrets.html",
deployments: "dev_guide/deployments/how_deployments_work.html",
pods: "architecture/core_concepts/pods_and_services.html#pods",
services: "architecture/core_concepts/pods_and_services.html#services",
routes: "architecture/networking/routes.html",
builds: "architecture/core_concepts/builds_and_image_streams.html#builds",
"image-streams": "architecture/core_concepts/builds_and_image_streams.html#image-streams",
storage: "architecture/additional_concepts/storage.html",
"build-hooks": "dev_guide/builds/build_hooks.html",
default: "welcome/index.html"
},
CLI: {
"Latest Release": "https://github.com/openshift/origin/releases/latest"
},
DEFAULT_HPA_CPU_TARGET_PERCENT: null,
DISABLE_OVERVIEW_METRICS: !1,
DISABLE_CUSTOM_METRICS: !1,
DISABLE_WILDCARD_ROUTES: !0,
DISABLE_CONFIRM_ON_EXIT: !1,
DISABLE_SERVICE_CATALOG_LANDING_PAGE: !1,
AVAILABLE_KINDS_BLACKLIST: [],
DISABLE_GLOBAL_EVENT_WATCH: !1,
DISABLE_COPY_LOGIN_COMMAND: !0,
ENABLE_TECH_PREVIEW_FEATURE: {
pod_presets: !1
},
SAMPLE_PIPELINE_TEMPLATE: {
name: "jenkins-pipeline-example",
namespace: "openshift"
},
CREATE_FROM_URL_WHITELIST: [ "openshift" ],
SECURITY_CHECK_WHITELIST: [ {
resource: "buildconfigs",
group: ""
}, {
resource: "buildconfigs",
group: "build.openshift.io"
}, {
resource: "builds",
group: ""
}, {
resource: "builds",
group: "build.openshift.io"
}, {
resource: "configmaps",
group: ""
}, {
resource: "daemonsets",
group: "extensions"
}, {
resource: "deployments",
group: "apps"
}, {
resource: "deployments",
group: "extensions"
}, {
resource: "deploymentconfigs",
group: ""
}, {
resource: "deploymentconfigs",
group: "apps.openshift.io"
}, {
resource: "endpoints",
group: ""
}, {
resource: "events",
group: ""
}, {
resource: "horizontalpodautoscalers",
group: "autoscaling"
}, {
resource: "horizontalpodautoscalers",
group: "extensions"
}, {
resource: "imagestreamimages",
group: ""
}, {
resource: "imagestreamimages",
group: "image.openshift.io"
}, {
resource: "imagestreams",
group: ""
}, {
resource: "imagestreams",
group: "image.openshift.io"
}, {
resource: "imagestreamtags",
group: ""
}, {
resource: "imagestreamtags",
group: "image.openshift.io"
}, {
resource: "ingresses",
group: "extensions"
}, {
resource: "jobs",
group: "batch"
}, {
resource: "persistentvolumeclaims",
group: ""
}, {
resource: "pods",
group: ""
}, {
resource: "podtemplates",
group: ""
}, {
resource: "replicasets",
group: "extensions"
}, {
resource: "replicationcontrollers",
group: ""
}, {
resource: "routes",
group: ""
}, {
resource: "routes",
group: "route.openshift.io"
}, {
resource: "secrets",
group: ""
}, {
resource: "serviceaccounts",
group: ""
}, {
resource: "servicebindings",
group: "servicecatalog.k8s.io"
}, {
resource: "serviceinstances",
group: "servicecatalog.k8s.io"
}, {
resource: "services",
group: ""
}, {
resource: "statefulsets",
group: "apps"
} ],
MEMBERSHIP_WHITELIST: [ "admin", "basic-user", "edit", "system:deployer", "system:image-builder", "system:image-puller", "system:image-pusher", "view" ],
EVENTS_TO_SHOW: {
FailedCreate: !0,
FailedDelete: !0,
FailedScheduling: !0,
FailedUpdate: !0,
BuildCancelled: !0,
BuildCompleted: !0,
BuildFailed: !0,
BuildStarted: !0,
BuildConfigInstantiateFailed: !0,
Failed: !0,
DeploymentCreated: !0,
DeploymentCreationFailed: !0,
RolloutCancelled: !0,
FailedRescale: !0,
SuccessfulRescale: !0,
BackOff: !0,
FailedSync: !0,
InvalidEnvironmentVariableNames: !0,
Unhealthy: !0,
FailedBinding: !0,
ProvisioningFailed: !0,
VolumeDeleted: !0,
LoadBalancerUpdateFailed: !0,
Deprovisioning: !0,
ErrorCallingProvision: !0,
ErrorInjectingBindResult: !0,
ProvisionCallFailed: !0,
ProvisionedSuccessfully: !0,
Provisioning: !0,
ReferencesNonexistentServiceClass: !0,
ReferencesNonexistentServicePlan: !0,
UnbindCallFailed: !0
},
PROJECT_NAVIGATION: function() {
return [ {
label: "概述",
iconClass: "fa fa-dashboard",
href: "/overview"
}, {
label: "应用",
iconClass: "fa fa-cubes",
secondaryNavSections: [ {
items: [ {
label: "部署",
href: "/browse/deployments",
prefixes: [ "/add-config-volume", "/attach-pvc", "/browse/deployment/", "/browse/dc/", "/browse/rs/", "/browse/rc/", "/edit/autoscaler", "/edit/dc/", "/edit/health-checks", "/set-limits" ]
}, {
label: "状态集",
href: "/browse/stateful-sets",
prefixes: [ "/browse/stateful-sets/" ]
}, {
label: "容器组",
href: "/browse/pods",
prefixes: [ "/browse/pods/" ]
}, {
label: "服务",
href: "/browse/services",
prefixes: [ "/browse/services/" ]
}, {
label: "路由",
href: "/browse/routes",
prefixes: [ "/browse/routes/", "/create-route", "/edit/routes/" ]
}, {
label: "预配服务",
href: "/browse/service-instances",
prefixes: [ "/browse/service-instances/" ],
canI: {
resource: "serviceinstances",
group: "servicecatalog.k8s.io",
verb: "list"
}
} ]
} ]
}, {
label: "构建",
iconClass: "pficon pficon-build",
secondaryNavSections: [ {
items: [ {
label: "构建",
href: "/browse/builds",
prefixes: [ "/browse/builds/", "/browse/builds-noconfig/", "/edit/builds/" ]
}, {
label: "管道",
href: "/browse/pipelines",
prefixes: [ "/browse/pipelines/", "/edit/pipelines/" ]
}, {
label: "映像",
href: "/browse/images",
prefixes: [ "/browse/images/" ]
} ]
} ]
}, {
label: "资源",
iconClass: "fa fa-files-o",
secondaryNavSections: [ {
items: [ {
label: "配额",
href: "/quota"
}, {
label: "成员",
href: "/membership",
canI: {
resource: "rolebindings",
verb: "list"
}
}, {
label: "配置映射",
href: "/browse/config-maps",
prefixes: [ "/browse/config-maps/", "/create-config-map", "/edit/config-maps/" ]
}, {
label: "秘钥",
href: "/browse/secrets",
prefixes: [ "/browse/secrets/", "/create-secret" ],
canI: {
resource: "secrets",
verb: "list"
}
}, {
label: "其他资源",
href: "/browse/other"
} ]
} ]
}, {
label: "存储",
iconClass: "pficon pficon-container-node",
href: "/browse/storage",
prefixes: [ "/browse/storage/", "/browse/persistentvolumeclaims/", "/create-pvc" ]
}, {
label: "监控",
iconClass: "pficon pficon-screen",
href: "/monitoring",
prefixes: [ "/browse/events" ]
}, {
label: "目录",
iconClass: "pficon pficon-catalog",
href: "/catalog",
canI: {
addToProject: !0
}
} ];
},
CATALOG_CATEGORIES: function() {
return [ {
id: "languages",
label: "语言",
iconClassDefault: "fa fa-code",
items: [ {
id: "java",
label: "Java",
iconClass: "font-icon icon-openjdk",
subcategories: [ {
id: "java-subcategories",
items: [ {
id: "amq",
label: "Red Hat JBoss A-MQ"
}, {
id: "processserver",
label: "Red Hat JBoss BPM Suite"
}, {
id: "decisionserver",
label: "Red Hat JBoss BRMS"
}, {
id: "datagrid",
label: "Red Hat JBoss Data Grid"
}, {
id: "eap",
label: "Red Hat JBoss EAP"
}, {
id: "jboss-fuse",
label: "Red Hat JBoss Fuse"
}, {
id: "tomcat",
label: "Red Hat JBoss Web Server (Tomcat)"
}, {
id: "sso",
label: "Red Hat Single Sign-On"
}, {
id: "wildfly",
label: "WildFly"
} ]
} ]
}, {
id: "javascript",
categoryAliases: [ "nodejs", "js" ],
label: "JavaScript",
iconClass: "font-icon icon-js"
}, {
id: "dotnet",
label: ".NET",
iconClass: "font-icon icon-dotnet"
}, {
id: "perl",
label: "Perl",
iconClass: "font-icon icon-perl"
}, {
id: "php",
label: "PHP",
iconClass: "font-icon icon-php"
}, {
id: "python",
label: "Python",
iconClass: "font-icon icon-python"
}, {
id: "ruby",
label: "Ruby",
iconClass: "font-icon icon-ruby"
}, {
id: "Golang",
categoryAliases: [ "go" ],
label: "Go",
iconClass: "font-icon icon-go-gopher"
} ]
}, {
id: "technologies",
label: "技术",
items: [ {
id: "business-process-services",
categoryAliases: [ "decisionserver", "processserver" ],
label: "业务流程服务",
description: "Model, automate, and orchestrate business processes across applications, services, and data."
}, {
id: "ci-cd",
categoryAliases: [ "jenkins" ],
label: "持续集成和部署",
description: "Automate the build, test, and deployment of your application with each new code revision."
}, {
id: "datastore",
categoryAliases: [ "database", "datagrid" ],
label: "数据仓库",
description: "Store and manage collections of data."
}, {
id: "messaging",
label: "消息",
description: "Facilitate communication between applications and distributed processes with a messaging server."
}, {
id: "integration",
label: "集成",
description: "Connect with other applications and data to enhance functionality without duplication."
}, {
id: "single-sign-on",
categoryAliases: [ "sso" ],
label: "单点登录",
description: "A centralized authentication server for users to log in, log out, register, and manage user accounts for applications and RESTful web services."
}, {
id: "",
label: "未分类",
description: ""
} ]
} ];
},
SAAS_OFFERINGS: [],
APP_LAUNCHER_NAVIGATION: [],
QUOTA_NOTIFICATION_MESSAGE: {},
LOGO_BASE_URL: "images/logos/",
LOGOS: {
"icon-3scale": "3scale.svg",
"icon-aerogear": "aerogear.svg",
"icon-amq": "amq.svg",
"icon-angularjs": "angularjs.svg",
"icon-ansible": "ansible.svg",
"icon-apache": "apache.svg",
"icon-beaker": "beaker.svg",
"icon-capedwarf": "capedwarf.svg",
"icon-cassandra": "cassandra.svg",
"icon-clojure": "clojure.svg",
"icon-codeigniter": "codeigniter.svg",
"icon-cordova": "cordova.png",
"icon-datagrid": "datagrid.svg",
"icon-datavirt": "datavirt.svg",
"icon-debian": "debian.svg",
"icon-decisionserver": "decisionserver.svg",
"icon-django": "django.svg",
"icon-dotnet": "dotnet.svg",
"icon-drupal": "drupal.svg",
"icon-eap": "eap.svg",
"icon-elastic": "elastic.svg",
"icon-erlang": "erlang.svg",
"icon-fedora": "fedora.svg",
"icon-freebsd": "freebsd.svg",
"icon-git": "git.svg",
"icon-github": "github.svg",
"icon-gitlab": "gitlab.svg",
"icon-glassfish": "glassfish.svg",
"icon-go-gopher": "go-gopher.svg",
"icon-grails": "grails.svg",
"icon-hadoop": "hadoop.svg",
"icon-haproxy": "haproxy.svg",
"icon-infinispan": "infinispan.svg",
"icon-jboss": "jboss.svg",
"icon-jenkins": "jenkins.svg",
"icon-jetty": "jetty.svg",
"icon-joomla": "joomla.svg",
"icon-jruby": "jruby.svg",
"icon-js": "js.svg",
"icon-kubevirt": "kubevirt.svg",
"icon-laravel": "laravel.svg",
"icon-load-balancer": "load-balancer.svg",
"icon-mariadb": "mariadb.svg",
"icon-mediawiki": "mediawiki.svg",
"icon-memcached": "memcached.svg",
"icon-mongodb": "mongodb.svg",
"icon-mssql": "mssql.svg",
"icon-mysql-database": "mysql-database.svg",
"icon-nginx": "nginx.svg",
"icon-nodejs": "nodejs.svg",
"icon-openjdk": "openjdk.svg",
"icon-openshift": "openshift.svg",
"icon-openstack": "openstack.svg",
"icon-other-linux": "other-linux.svg",
"icon-other-unknown": "other-unknown.svg",
"icon-perl": "perl.svg",
"icon-phalcon": "phalcon.svg",
"icon-php": "php.svg",
"icon-play": "play.svg",
"icon-postgresql": "postgresql.svg",
"icon-processserver": "processserver.svg",
"icon-python": "python.svg",
"icon-rabbitmq": "rabbitmq.svg",
"icon-rails": "rails.svg",
"icon-redis": "redis.svg",
"icon-rh-integration": "rh-integration.svg",
"icon-rh-openjdk": "openjdk.svg",
"icon-rh-tomcat": "rh-tomcat.svg",
"icon-ruby": "ruby.svg",
"icon-scala": "scala.svg",
"icon-shadowman": "shadowman.svg",
"icon-spring": "spring.svg",
"icon-sso": "sso.svg",
"icon-stackoverflow": "stackoverflow.svg",
"icon-suse": "suse.svg",
"icon-symfony": "symfony.svg",
"icon-tomcat": "tomcat.svg",
"icon-ubuntu": "ubuntu.svg",
"icon-wildfly": "wildfly.svg",
"icon-windows": "windows.svg",
"icon-wordpress": "wordpress.svg",
"icon-xamarin": "xamarin.svg",
"icon-zend": "zend.svg"
},
CLUSTER_RESOURCE_OVERRIDES_EXEMPT_PROJECT_NAMES: [ "openshift", "kubernetes", "kube" ],
CLUSTER_RESOURCE_OVERRIDES_EXEMPT_PROJECT_PREFIXES: [ "openshift-", "kubernetes-", "kube-" ]
}), angular.module("openshiftConsole", [ "ngAnimate", "ngCookies", "ngResource", "ngRoute", "ngSanitize", "kubernetesUI", "registryUI.images", "ui.bootstrap", "patternfly.charts", "patternfly.navigation", "patternfly.sort", "patternfly.notification", "openshiftConsoleTemplates", "ui.ace", "extension-registry", "as.sortable", "ui.select", "angular-inview", "angularMoment", "ab-base64", "openshiftCommonServices", "openshiftCommonUI", "webCatalog", "gettext" ]).config([ "$routeProvider", "$uibModalProvider", "HomePagePreferenceServiceProvider", function(e, t, n) {
var a, r = {
templateUrl: "views/projects.html",
controller: "ProjectsController"
};
a = _.get(window, "OPENSHIFT_CONSTANTS.DISABLE_SERVICE_CATALOG_LANDING_PAGE") ? r : {
templateUrl: "views/landing-page.html",
controller: "LandingPageController",
reloadOnSearch: !1
}, e.when("/projects", r), e.when("/", {
redirectTo: function() {
return n.$get().getHomePagePath();
}
}).when("/catalog", a).when("/create-project", {
templateUrl: "views/create-project.html",
controller: "CreateProjectController"
}).when("/project/:project/catalog", {
templateUrl: "views/project-browse-catalog.html",
controller: "ProjectBrowseCatalogController"
}).when("/project/:project", {
redirectTo: function(e) {
return "/project/" + encodeURIComponent(e.project) + "/overview";
}
}).when("/project/:project/overview", {
templateUrl: "views/overview.html",
controller: "OverviewController",
controllerAs: "overview",
reloadOnSearch: !1
}).when("/project/:project/quota", {
templateUrl: "views/quota.html",
controller: "QuotaController"
}).when("/project/:project/monitoring", {
templateUrl: "views/monitoring.html",
controller: "MonitoringController",
reloadOnSearch: !1
}).when("/project/:project/membership", {
templateUrl: "views/membership.html",
controller: "MembershipController",
reloadOnSearch: !1
}).when("/project/:project/browse", {
redirectTo: function(e) {
return "/project/" + encodeURIComponent(e.project) + "/browse/pods";
}
}).when("/project/:project/browse/builds", {
templateUrl: "views/builds.html",
controller: "BuildsController",
reloadOnSearch: !1
}).when("/project/:project/browse/pipelines", {
templateUrl: "views/pipelines.html",
controller: "PipelinesController"
}).when("/project/:project/browse/builds/:buildconfig", {
templateUrl: "views/browse/build-config.html",
controller: "BuildConfigController",
reloadOnSearch: !1
}).when("/project/:project/browse/pipelines/:buildconfig", {
templateUrl: "views/browse/build-config.html",
controller: "BuildConfigController",
resolve: {
isPipeline: [ "$route", function(e) {
e.current.params.isPipeline = !0;
} ]
},
reloadOnSearch: !1
}).when("/project/:project/edit/yaml", {
templateUrl: "views/edit/yaml.html",
controller: "EditYAMLController"
}).when("/project/:project/edit/builds/:buildconfig", {
templateUrl: "views/edit/build-config.html",
controller: "EditBuildConfigController"
}).when("/project/:project/edit/pipelines/:buildconfig", {
templateUrl: "views/edit/build-config.html",
controller: "EditBuildConfigController",
resolve: {
isPipeline: [ "$route", function(e) {
e.current.params.isPipeline = !0;
} ]
},
reloadOnSearch: !1
}).when("/project/:project/browse/builds/:buildconfig/:build", {
templateUrl: function(e) {
return "chromeless" === e.view ? "views/logs/chromeless-build-log.html" : "views/browse/build.html";
},
controller: "BuildController",
reloadOnSearch: !1
}).when("/project/:project/browse/pipelines/:buildconfig/:build", {
templateUrl: "views/browse/build.html",
controller: "BuildController",
resolve: {
isPipeline: [ "$route", function(e) {
e.current.params.isPipeline = !0;
} ]
},
reloadOnSearch: !1
}).when("/project/:project/browse/builds-noconfig/:build", {
templateUrl: "views/browse/build.html",
controller: "BuildController",
reloadOnSearch: !1
}).when("/project/:project/browse/pipelines-noconfig/:build", {
templateUrl: "views/browse/build.html",
controller: "BuildController",
resolve: {
isPipeline: [ "$route", function(e) {
e.current.params.isPipeline = !0;
} ]
},
reloadOnSearch: !1
}).when("/project/:project/browse/deployments", {
templateUrl: "views/deployments.html",
controller: "DeploymentsController",
reloadOnSearch: !1
}).when("/project/:project/browse/deployment/:deployment", {
templateUrl: "views/browse/deployment.html",
controller: "DeploymentController",
reloadOnSearch: !1
}).when("/project/:project/browse/dc/:deploymentconfig", {
templateUrl: "views/browse/deployment-config.html",
controller: "DeploymentConfigController",
reloadOnSearch: !1
}).when("/project/:project/edit/dc/:deploymentconfig", {
templateUrl: "views/edit/deployment-config.html",
controller: "EditDeploymentConfigController"
}).when("/project/:project/browse/stateful-sets/", {
templateUrl: "views/browse/stateful-sets.html",
controller: "StatefulSetsController",
reloadOnSearch: !1
}).when("/project/:project/browse/stateful-sets/:statefulset", {
templateUrl: "views/browse/stateful-set.html",
controller: "StatefulSetController",
reloadOnSearch: !1
}).when("/project/:project/browse/rs/:replicaSet", {
templateUrl: "views/browse/replica-set.html",
resolve: {
kind: function() {
return "ReplicaSet";
}
},
controller: "ReplicaSetController",
reloadOnSearch: !1
}).when("/project/:project/browse/rc/:replicaSet", {
templateUrl: function(e) {
return "chromeless" === e.view ? "views/logs/chromeless-deployment-log.html" : "views/browse/replica-set.html";
},
resolve: {
kind: function() {
return "ReplicationController";
}
},
controller: "ReplicaSetController",
reloadOnSearch: !1
}).when("/project/:project/browse/events", {
templateUrl: "views/events.html",
controller: "EventsController"
}).when("/project/:project/browse/images", {
templateUrl: "views/images.html",
controller: "ImagesController",
reloadOnSearch: !1
}).when("/project/:project/browse/images/:imagestream", {
templateUrl: "views/browse/imagestream.html",
controller: "ImageStreamController"
}).when("/project/:project/browse/images/:imagestream/:tag", {
templateUrl: "views/browse/image.html",
controller: "ImageController",
reloadOnSearch: !1
}).when("/project/:project/browse/pods", {
templateUrl: "views/pods.html",
controller: "PodsController",
reloadOnSearch: !1
}).when("/project/:project/browse/pods/:pod", {
templateUrl: function(e) {
return "chromeless" === e.view ? "views/logs/chromeless-pod-log.html" : "views/browse/pod.html";
},
controller: "PodController",
reloadOnSearch: !1
}).when("/project/:project/browse/services", {
templateUrl: "views/services.html",
controller: "ServicesController",
reloadOnSearch: !1
}).when("/project/:project/browse/services/:service", {
templateUrl: "views/browse/service.html",
controller: "ServiceController",
reloadOnSearch: !1
}).when("/project/:project/browse/service-instances", {
templateUrl: "views/service-instances.html",
controller: "ServiceInstancesController",
reloadOnSearch: !1
}).when("/project/:project/browse/service-instances/:instance", {
templateUrl: "views/browse/service-instance.html",
controller: "ServiceInstanceController",
reloadOnSearch: !1
}).when("/project/:project/browse/storage", {
templateUrl: "views/storage.html",
controller: "StorageController",
reloadOnSearch: !1
}).when("/project/:project/browse/secrets/:secret", {
templateUrl: "views/browse/secret.html",
controller: "SecretController",
reloadOnSearch: !1
}).when("/project/:project/browse/secrets", {
templateUrl: "views/secrets.html",
controller: "SecretsController",
reloadOnSearch: !1
}).when("/project/:project/create-secret", {
templateUrl: "views/create-secret.html",
controller: "CreateSecretController"
}).when("/project/:project/browse/config-maps", {
templateUrl: "views/browse/config-maps.html",
controller: "ConfigMapsController",
reloadOnSearch: !1
}).when("/project/:project/browse/config-maps/:configMap", {
templateUrl: "views/browse/config-map.html",
controller: "ConfigMapController"
}).when("/project/:project/create-config-map", {
templateUrl: "views/create-config-map.html",
controller: "CreateConfigMapController"
}).when("/project/:project/edit/config-maps/:configMap", {
templateUrl: "views/edit/config-map.html",
controller: "EditConfigMapController"
}).when("/project/:project/browse/other", {
templateUrl: "views/other-resources.html",
controller: "OtherResourcesController",
reloadOnSearch: !1
}).when("/project/:project/browse/persistentvolumeclaims/:pvc", {
templateUrl: "views/browse/persistent-volume-claim.html",
controller: "PersistentVolumeClaimController"
}).when("/project/:project/browse/routes", {
templateUrl: "views/browse/routes.html",
controller: "RoutesController",
reloadOnSearch: !1
}).when("/project/:project/edit/routes/:route", {
templateUrl: "views/edit/route.html",
controller: "EditRouteController"
}).when("/project/:project/browse/routes/:route", {
templateUrl: "views/browse/route.html",
controller: "RouteController"
}).when("/project/:project/create-route", {
templateUrl: "views/create-route.html",
controller: "CreateRouteController"
}).when("/project/:project/edit", {
templateUrl: "views/edit/project.html",
controller: "EditProjectController"
}).when("/project/:project/create-pvc", {
templateUrl: "views/create-persistent-volume-claim.html",
controller: "CreatePersistentVolumeClaimController"
}).when("/project/:project/attach-pvc", {
templateUrl: "views/attach-pvc.html",
controller: "AttachPVCController"
}).when("/project/:project/add-config-volume", {
templateUrl: "views/add-config-volume.html",
controller: "AddConfigVolumeController"
}).when("/project/:project/create", {
templateUrl: "views/create.html",
controller: "CreateController",
reloadOnSearch: !1
}).when("/project/:project/create/category/:category", {
templateUrl: "views/create/category.html",
controller: "BrowseCategoryController"
}).when("/project/:project/create/category/:category/:subcategory", {
templateUrl: "views/create/category.html",
controller: "BrowseCategoryController"
}).when("/project/:project/create/fromtemplate", {
templateUrl: "views/newfromtemplate.html",
controller: "NewFromTemplateController"
}).when("/project/:project/create/fromimage", {
templateUrl: "views/create/fromimage.html",
controller: "CreateFromImageController"
}).when("/project/:project/create/next", {
templateUrl: "views/create/next-steps.html",
controller: "NextStepsController"
}).when("/project/:project/set-limits", {
templateUrl: "views/set-limits.html",
controller: "SetLimitsController"
}).when("/project/:project/edit/autoscaler", {
templateUrl: "views/edit/autoscaler.html",
controller: "EditAutoscalerController"
}).when("/project/:project/edit/health-checks", {
templateUrl: "views/edit/health-checks.html",
controller: "EditHealthChecksController"
}).when("/about", {
templateUrl: "views/about.html",
controller: "AboutController"
}).when("/command-line", {
templateUrl: "views/command-line.html",
controller: "CommandLineController"
}).when("/oauth", {
templateUrl: "views/util/oauth.html",
controller: "OAuthController"
}).when("/error", {
templateUrl: "views/util/error.html",
controller: "ErrorController"
}).when("/logout", {
templateUrl: "views/util/logout.html",
controller: "LogoutController"
}).when("/create", {
templateUrl: "views/create-from-url.html",
controller: "CreateFromURLController"
}).when("/createProject", {
redirectTo: "/create-project"
}).when("/project/:project/createRoute", {
redirectTo: "/project/:project/create-route"
}).when("/project/:project/attachPVC", {
redirectTo: "/project/:project/attach-pvc"
}).when("/project/:project/browse/deployments/:deploymentconfig", {
redirectTo: "/project/:project/browse/dc/:deploymentconfig"
}).when("/project/:project/browse/deployments/:deploymentconfig/:rc", {
redirectTo: "/project/:project/browse/rc/:rc"
}).when("/project/:project/browse/deployments-replicationcontrollers/:rc", {
redirectTo: "/project/:project/browse/rc/:rc"
}).otherwise({
redirectTo: "/"
}), t.options = {
animation: !0,
backdrop: "static"
};
} ]).constant("LOGGING_URL", _.get(window.OPENSHIFT_CONFIG, "loggingURL")).constant("METRICS_URL", _.get(window.OPENSHIFT_CONFIG, "metricsURL")).constant("SOURCE_URL_PATTERN", /^[a-z][a-z0-9+.-@]*:(\/\/)?[0-9a-z_-]+/i).constant("RELATIVE_PATH_PATTERN", /^(?!\/)(?!\.\.(\/|$))(?!.*\/\.\.(\/|$)).*$/).constant("IS_SAFARI", /Version\/[\d\.]+.*Safari/.test(navigator.userAgent)).constant("amTimeAgoConfig", {
titleFormat: "LLL"
}).config([ "kubernetesContainerSocketProvider", function(e) {
e.WebSocketFactory = "ContainerWebSocket";
} ]).config([ "$compileProvider", function(e) {
e.aHrefSanitizationWhitelist(/^\s*(https?|mailto|git):/i);
} ]).run([ "$rootScope", "LabelFilter", function(e, t) {
t.persistFilterState(!0), e.$on("$routeChangeSuccess", function() {
t.readPersistedState();
});
} ]).run([ "$location", "$uibModal", "AuthService", function(e, t, n) {
function a() {
if (c) return !1;
c = !0, (i = t.open({
templateUrl: "views/modals/logout.html",
controller: "LogoutModalController",
backdrop: !0
})).result.then(function(e) {
"logout" === e ? (m(!0), p()) : "cancel" === e && (d(), c = !1);
}, function() {
d(), c = !1;
});
}
var r = window.OPENSHIFT_CONFIG.inactivityTimeoutMinutes;
if (r) {
var o, i, s = "origin-web-console-last-interaction-timestamp", c = !1, l = function() {
o = setInterval(function() {
if (n.isLoggedIn()) {
var e = Date.parse(localStorage.getItem(s));
isNaN(e) && (Logger.warn("Last interaction timestamp has been corrupted. The logout timeout will be restarted."), e = new Date()), new Date() - e > 6e4 * r && a();
}
}, 6e4);
}, u = function() {
i && (i.dismiss("User activity"), i = null), clearInterval(o), l();
}, d = function() {
u(), localStorage.setItem(s, new Date().toString());
}, m = function(e) {
localStorage.setItem("origin-web-console-inactivity-logout", e.toString());
}, p = function() {
var t = URI.expand("/logout{?cause*}", {
cause: "timeout"
});
e.url(t.toString());
};
$(window).on("storage", function(e) {
e.originalEvent.key === s ? u() : "origin-web-console-inactivity-logout" === e.originalEvent.key && "true" === localStorage.getItem("origin-web-console-inactivity-logout") && p();
}), n.onUserChanged(function() {
m(!1);
}), d(), $(document).bind("click keydown", _.throttle(d, 500));
}
} ]).run([ "durationFilter", "timeOnlyDurationFromTimestampsFilter", "countdownToTimestampFilter", function(e, t, n) {
setInterval(function() {
$(".duration[data-timestamp]").text(function(n, a) {
var r = $(this).data("timestamp"), o = $(this).data("omit-single"), i = $(this).data("precision");
return $(this).data("time-only") ? t(r, null) || a : e(r, null, o, i) || a;
}), $(".countdown[data-timestamp]").text(function(e, t) {
var a = $(this).data("timestamp");
return n(a);
});
}, 1e3);
} ]).run([ "IS_IOS", function(e) {
e && $("body").addClass("ios");
} ]).run([ "$rootScope", "APIService", function(e, t) {
e.AEROGEAR_MOBILE_ENABLED = !!t.apiInfo({
resource: "mobileclients",
group: "mobile.k8s.io"
}), e.AEROGEAR_MOBILE_ENABLED && window.OPENSHIFT_CONSTANTS.SERVICE_CATALOG_CATEGORIES.push({
id: "mobile",
label: "Mobile",
subCategories: [ {
id: "apps",
label: "Apps",
tags: [ "mobile" ],
icon: "fa fa-mobile"
}, {
id: "services",
label: "Services",
tags: [ "mobile-service" ],
icon: "fa fa-database"
} ]
}), Logger.info("AEROGEAR_MOBILE_ENABLED: " + e.AEROGEAR_MOBILE_ENABLED);
} ]).run([ "$rootScope", "APIService", "KubevirtVersions", function(e, t, n) {} ]).run([ "gettextCatalog", function(e) {
e.debug = !0, e.setCurrentLanguage("zh_CN"), e.setStrings("zh_CN", {
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
Back: "返回",
"Browse resources for": "浏览",
"Catalog Search": "目录搜索",
"Clear Search Input": "清除输入",
"Continue to the project overview": "继续项目概述",
"Create Project": "创建项目",
"Custom Add": "自定义添加",
"Delete Project": "删除项目",
"Deploy Image": "部署镜像",
Documentation: "文档",
"Edit Project": "编辑项目",
Error: "错误",
"Failed to update": "更新失败",
"Get Support": "获取支持",
"Getting Started": "开始",
"Git Repository": "Git 仓库",
"Git repository is required.": "需要Git仓库。",
"Go to Project": "进入项目",
"If you have a private Git repository or need to change application defaults, view": "如果有专用Git仓库或需要更改应用程序默认设置，请查看",
Image: "镜像",
"Image Dependencies": "镜像依赖",
"Import YAML / JSON": "导入 YAML / JSON",
Less: "更少",
More: "更多",
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
Show: "展示",
Support: "支持",
"Take Home Page Tour": "首页浏览",
"The binding will be created after the service has been provisioned.": "绑定将在提供服务之后创建。",
"The complete list of your projects could not be loaded. Type a project name to go to that project.": "无法加载项目的完整列表，键入要进入该项目的项目名称。",
"There are no plans currently available for this service.": "目前没有这个服务的可用计划。",
"This may take several minutes.": "这可能需要几分钟。",
"This might not be a valid Git URL. Check that it is the correct URL to a remote Git repository.": "这可能不是有效的Git URL，请检查远程Git仓库的URL是否正确。",
"This name is already in use. Please choose a different name.": " 此名称已在使用中。请选择不同的名称。",
"Try Sample Repository": "尝试范例仓库",
Updating: "更新中",
Version: "版本",
"View All": "查看所有",
"View Documentation": "查看文档",
"View Membership": "查看成员",
YourUsername: "你的用户名",
"a project.": "一个项目",
"advanced options": "高级选项",
by: "通过",
created: "创建",
Created: "创建",
"failed to create in": "无法创建",
"failed to provision in": "无法提供",
"has been added to": "已添加到",
"has been created in": "已创建到",
"has been updated in": "已更新到",
in: "在",
"is being created in": "被创建到",
"is being provisioned in": "被提供到",
"is being updated in": "被更新到",
"new-project": "新建项目",
"oc adm": "oc adm",
"or create": "或者创建",
projectname: "项目名称",
"successfully.": "成功。",
"to bind this service to your application. Binding this service creates a secret containing the information necessary for your application to use the service.": "将此服务绑定到应用程序。绑定此服务将创建包含应用程序使用服务所需的信息的秘钥。",
"to check the status of your application as it builds and deploys.": "检查应用程序在构建和部署时的状态。",
"to check the status of your service.": "检查服务的状态。",
Cancel: "取消",
"Confirm Login": "确认登录",
"Confirm User Change": "确认用户改变",
Continue: "继续",
Help: "帮助",
"Home Page Tour": "主页预览",
"If this is unexpected, click Cancel. This could be an attempt to trick you into acting as another user.": "如果意外，请单击“取消”。这可能是试图欺骗您充当另一个用户。",
"Log out": "退出",
"Logging in": "登录中",
Logout: "退出",
"Please wait while you are logged in": "登录中请稍候",
"Switch Users": "切换用户",
"Toggle navigation": "切换导航",
"Are you sure you want to delete the project": "确定删除这个项目吗",
Close: "关闭",
Collapse: "崩溃",
Create: "创建",
Delete: "删除",
"Delete Project {{projectName}}": "删除项目{{projectName}}",
Description: "描述",
"Display Name": "显示名称",
"Make sure this is something you really want to do!": "这将<.>删除与项目{project|displayName}}关联的所有资源</.>，并且无法撤消<.>。确保这是你真正想要做的事情！ ",
Name: "名称",
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
"A valid name is applied to all generated resources. It is an alphanumeric (a-z, and 0-9) string with a maximum length of 24 characters, where the first character is a letter (a-z), and the '-' character is allowed anywhere except the first or last character.": '有效的名称将应用于所有生成的资源。它是一个字母数字 (a-z 和 0-9) 字符串, 最大长度为24个字符, 其中第一个字符是字母 (a-z), 除第一个或最后一个字符外, 允许在任何地方使用 "-" 字符。',
"A value for replicas is required.": "副本的值是必需的。",
"A {{trigger.data.type}} webhook trigger referencing the secret {{(trigger | getWebhookSecretData).secretReference.name}} already exists.": "引用秘密 {{{{(触发链接数据)....... 秘密. name}} 已存在。",
About: "关于",
"About Compute Resources": "关于计算资源",
"About {{aboutTitle}}": "关于{{aboutTitle}}",
"Access Mode": "访问模式",
"Access Modes": "访问模式",
"Access Modes:": "访问模式：",
"Access: {{sclass | storageClassAccessMode}}": "访问：{{sclass | storageClassAccessMode}}",
Account: "账户",
"Action:": "操作：",
Actions: "操作",
"Active Deadline:": "活动截止日期:",
Add: "添加",
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
Age: "寿命",
"All content is hidden by the current filter.": "当前筛选器隐藏所有内容。",
"All events hidden by filter.": "过滤器隐藏的所有事件。",
"All pipelines are filtered.": "对所有管道进行筛选。",
Allow: "允许",
"Alternate Services": "备用服务",
"Alternate service for route traffic.": "路由流量的备用服务。",
"Always pull the builder image from the docker registry, even if it is present locally": "始终从docker镜像仓库提取生成器映像, 即使它在本地存在",
Amount: "金额",
"An error occurred deleting the binding.": "删除绑定时出错。",
"An error occurred getting metrics": "获取指标时出错",
"An error occurred loading the log.": "加载日志时出错。",
"An error occurred starting the debug pod.": "启动调试容器组时出错。",
"An image that can carry out the deployment.": "可以执行部署的映像。",
Application: "应用",
"Application Console": "应用控制台",
"Applied Parameter Values": "应用的参数值",
"Are you sure you want to delete the {{typeDisplayName || (kind | humanizeKind)}}": "确实要删除{{typeDisplayName || (kind | humanizeKind)}}",
"Are you sure you want to scale": "确实要扩展",
"Args:": "参数:",
Arguments: "参数",
"Authentication Type": "身份验证类型",
"Autodeploy when": "自动部署时",
"Automatically build a new image when the builder image changes": "生成器映像更改时自动生成新映像",
"Automatically start a new deployment when the image changes": "当映像更改时自动启动新部署",
"Autoscale {{targetKind | humanizeKind : true}} {{targetName}}": "自动扩展 {{targetKind | humanizeKind : true}} {{targetName}}",
"Autoscaled:": "自动扩展",
Autoscaling: "自动扩展中",
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
Bindings: "绑定",
"Bitbucket Webhook URL:": "Bitbucket Webhook URL地址:",
Browse: "浏览",
"Browse Catalog": "浏览目录",
"Browse Mobile Services": "浏览移动服务",
Build: "构建",
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
Builds: "构建",
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
Capacity: "容量",
"Capacity:": "容量：",
"Catalog Home (Default)": "目录主页 (默认值)",
Certificate: "证书",
"Certificate:": "证书:",
Certificates: "证书",
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
Cluster: "集群",
"Cluster Console": "集群控制台",
"Cluster IP": "集群IP",
"Collapse event sidebar": "崩溃事件边栏",
"Collapse to a single line input": "崩溃到单行输入",
Command: "命令",
"Command Line Tools": "命令行工具",
"Command:": "命令：",
"Compute Resources": "计算资源",
Config: "配置",
"Config Change For:": "配置更改为:",
"Config Map/Secret": "配置映射/秘钥",
"Config Map:": "配置映射:",
"Config Maps": "配置映射",
"Config change": "配置更改",
"Config map {[configMap.metadata.name}} has been deleted since you started editing it.": "自开始编辑配置映射 {[configMap.metadata.name}} 以来, 该地图已被删除。",
"Config map {{configMap.metadata.name}} has changed since you started editing it.": "自您开始编辑后，配置映射{{configMap.metadata.name}}已更改。",
"Config maps hold key-value pairs that can be used in pods to read application configuration.": "配置映射包含可在容器组中使用的键值对，以读取应用程序配置。",
"Config maps hold key-value pairs that can be used in pods to read applicationconfiguration.": "配置映射保存可在容器组中用于读取应用程序配置的键值对。",
Configuration: "配置",
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
Containers: "容器",
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
Dashboard: "管理面板",
"Debug Container {{container.name}}": "调试容器 {{container.name}}",
"Debug in Terminal": "在终端调试",
"Debugging pod {{pod | debugPodSourceName}}": "调试容器组  {{pod | debugPodSourceName}}",
"Decimal Units": "十进制单位",
Default: "默认",
"Delay can't be negative.": "延迟不能为负数。",
"Delete Binding": "删除绑定",
"Delete This Service": "删除此服务",
"Delete pod immediately without waiting for the processes to terminate gracefully": "立即删除窗格, 而无需等待进程正常终止",
"Delete row": "删除行",
"Delete {{kind | humanizeKind}} {{resourceName}}": "删除  {{kind | humanizeKind}} {{resourceName}}",
"Deletion of Binding Failed": "删除绑定失败",
Deploy: "部署",
"Deploy an existing image from an image stream tag or image registry.": "从镜像流标记或镜像注册表部署现有镜像。",
Deployment: "部署",
"Deployment Config:": "部署配置:",
"Deployment Configs": "部署配置",
"Deployment Strategy": "部署战略",
"Deployment configuration changes": "部署配置更改",
"Deployment:": "部署",
Deployments: "部署",
"Desired storage capacity.": "所需的存储容量。",
"Destination CA Cert:": "目的地 ca 证书:",
"Destination CA Certificate": "目标 ca 证书",
"Destination Directory": "目标目录",
Details: "说明",
"Directory where the files will be available at build time.": "文件在生成时可用的目录。",
Dismiss: "清除",
"Do not share your API token. To reveal your token, press the copy to clipboard button and then paste the clipboard contents.": "不要共享您的API令牌。要显示您的令牌，请按复制到剪贴板按钮，然后粘贴剪贴板内容。",
"Do you want to replace the existing resources?": "您想替换现有资源吗？",
"Do you want to replace with the new content?": "是否要替换为新内容？",
"Docker Image Repository": "docker 镜像仓库",
"Docker Repo": "Docker Repo",
Dockerfile: "Dockerfile",
"Dockerfile Path": "Dockerfile 路径",
"Dockerfile:": "Dockerfile:",
"Done Editing": "编辑完成",
Download: "下载",
"Drop file here": "删除文件",
'Duplicate key "{{item.key}}". Keys must be unique within the {{type}}.': '重复的键 "{item.key}}"。键在 {{type} 中必须是唯一的。',
Duration: "持续时间",
"Duration:": "持续时间：",
"Each container running on a node uses compute resources like CPU and memory. You can specify how much CPU and memory a container needs to improve scheduling and performance.": "在节点上运行的每个容器都使用CPU和内存等计算资源。您可以指定容器需要多少CPU和内存来改善调度和性能。",
"Each millicore is equivalent to": "每个millicore相当于",
Edit: "编辑",
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
Email: "邮箱",
"Email is required.": "邮箱必需",
"Email must be in the form of": "电子邮件必须以",
"End of log": "日志结束",
"Enter the command to run inside the container. The command is considered successful if its exit code is 0. Drag and drop to reorder arguments.": "输入要在容器内运行的命令。如果退出代码为0，则该命令被视为成功。拖放以重新排序参数。",
Environment: "环境",
"Environment From": "环境来自",
"Environment Variables": "环境变量",
"Environment Variables:": "环境变量:",
"Environment variables": "环境变量",
"Environment variables can be edited on deployment config": "可以在部署配置时编辑环境变量",
"Environment variables can be edited on the": "可以在上面编辑环境变量",
"Environment variables can be edited on the deployment": "可以在部署中编辑环境变量",
"Environment variables to supply to the hook pod's container.": "要提供给挂接容器的环境变量。",
Errors: "错误",
Events: "事件",
"Execute docker build without reusing cached instructions.": "在不重复使用缓存指令的情况下执行docke构建。",
"Exit code: {{containerState.terminated.exitCode}}": "退出代码: {{containerState.terminated.exitCode}}",
Expand: "展开",
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
Filter: "过滤",
"Filter by keyword": "按关键字过滤",
"Filter by keyword or change sort options to see other projects.": "按关键字过滤或更改排序选项以查看其他项目。",
"Filter by labels": "按标签过滤",
"Filter by name": "按名称过滤",
"Filter by name or description": "按名称或说明过滤",
Find: "查找",
Follow: "跟随",
"For other information about the command line tools, check the": "有关命令行工具的其他信息，请查看",
Generate: "生成",
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
Hide: "隐藏",
"Hide Advanced Image Options": "高级映像选项",
"Hide Advanced Strategy Options": "隐藏高级策略选项",
"Hide Image Environment Variables": "隐藏映像环境变量",
"Hide examples": "隐藏示例",
"Hide older resources": "隐藏旧资源",
History: "历史",
"Hook Types": "钩子类型",
Hooks: "钩子",
"Horizontal Pod Autoscaler": "容器组水平自动扩展",
Hostname: "主机名",
"Hostname must consist of lower-case letters, numbers, periods, and  hyphens. It must start and end with a letter or number.": "主机名必须由小写字母，数字，句点和连字符组成。它必须以字母或数字开头和结尾。",
"Hostname:": "主机名:",
"How long to wait after the container starts before checking its health.": "在检查其运行状况之前，容器启动后需要等待多长时间。",
"How long to wait for a pod to scale up before giving up.": "在放弃之前等待容器组扩展多长时间。",
"How long to wait for the probe to finish. If the time is exceeded, the probe is considered failed.": "等待探头完成多长时间。如果超过时间，则认为探测失败。",
"Identifies the resources created for this application.": "标识为此应用程序创建的资源。",
"Identifies the resources created for this image.": "标识为此映像创建的资源。",
Idle: "空闲",
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
Images: "映像",
"Increase the capacity of claim": "增加定义容量",
"Ingress Points:": "入口点:",
"Init Containers": "初始化",
"Init container {{containerStatus.name}}": "初始化容器{{containerStatus.name}}",
"Initial Delay": "初始化延迟",
"Input Required": "输入必需",
"Insecure Traffic": "不安全的流量",
"Insecure Traffic:": "不安全流量",
"Instance Name": "实例名称",
Interval: "间隔",
"Interval can't be negative.": "间隔不能是负面的。",
"Interval:": "时间间隔：",
"It cannot be undone. Make sure this is something you really want to do!": "它无法撤消。确保这是你真正想做的事情！",
"Jenkins Pipeline Configuration": "Jenkins管道配置",
Jenkinsfile: "Jenkinsfile",
"Jenkinsfile Examples": "Jenkinsfile 示例",
"Jenkinsfile Path:": "Jenkinsfile路径：",
"Jenkinsfile Source Path": "Jenkinsfile源路径",
"Jenkinsfile Type": "Jenkinsfile类型",
"Jenkinsfile:": "Jenkinsfile：",
Key: "关键值",
"Key is required.": "关键值是必须的",
"Key to File:": "文件关键值",
"Key:": "关键值：",
"Keys and Paths": "关键值和路径",
"Keys may not be longer than 253 characters.": "关键值长度不得超过253个字符。",
"Keys may only consist of letters, numbers, periods, hyphens, and underscores.": "关键值可能只包含字母，数字，句点，连字符和下划线。",
Kind: "类",
"Kind and Name": "类和名称",
"Kubernetes Master:": "Kubernetes管理端：",
Labels: "标签",
"Last 15 Minutes": "最后15分钟",
"Last Build": "最后一次构建",
"Last Scaled:": "最后扩展:",
"Last State": "最后状态",
"Last Version": "最后版本",
"Launch the first build when the build configuration is created": "在创建构建配置时启动第一个构建",
Layers: "层",
"Learn More": "学到更多",
"Learn more about": "学习更多关于",
"Learn more about the": "学习更多关于",
"Lifecycle Action": "生命周期行动",
Limit: "限制",
"Limit Range": "限制范围",
"Limit can't be less than request ({{request | usageWithUnits : type}}).": "限制不能小于请求（{{request | usageWithUnits：type}}）。",
"Limit cannot be more than {{maxLimitRequestRatio}} times request value. (Request: {{request | usageWithUnits : type}},Limit: {{(input.amount ? (input.amount + input.unit) : defaultValue) | usageWithUnits : type}})": "限制不能超过 {{maxLimitRequestRatio}} times request value. (Request: {{request | usageWithUnits : type}},Limit: {{(input.amount ? (input.amount + input.unit) : defaultValue) | usageWithUnits : type}})",
"Limit is required if request is set. (Max Limit/Request Ratio: {{maxLimitRequestRatio}})": "如果设置了请求，则需要限制。 (Max Limit/Request Ratio: {{maxLimitRequestRatio}})",
Limits: "限制",
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
Logs: "日志",
"Logs are not available for replica sets.": "日志不适用于副本集。",
"Logs are not available for stateful sets.": "日志不适用于有状态集。",
"Logs are not available.": "日志不可用。",
"Making code changes": "进行代码更改",
"Manual (CLI):": "手动（CLI）：",
"Manual build": "手动构建",
"Mark Read": "设为已读",
"Marked for Deletion": "标记为删除",
Max: "最大值",
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
Membership: "成员",
Memory: "内存",
"Memory and Storage": "内存和存储",
"Memory:": "内 存：",
Message: "消息",
"Message Unread.": "消息未读。",
"Message:": "信息：",
Messages: "信息",
Metrics: "指标",
"Metrics are not available.": "指标不可用。",
"Metrics might not be configured by your cluster administrator. Metrics are required for autoscaling.": "您的群集管理员可能未配置度量标准。自动扩展需要度量标准。",
MiB: "MiB",
"Mid Lifecycle Hook": "中期生命周期钩",
"Mid hooks execute after the previous deployment is scaled down to zero and before the first pod of the new deployment is created.": "在先前部署缩小到零之后并且在创建新部署的第一个容器组之前执行中间挂钩。",
Min: "最小值",
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
Namespace: "命名空间",
"Namespace: {{ resource.metadata.namespace }}": "命名空间: {{resource.metadata.namespace}}",
"Namespace: {{imageStream.metadata.namespace}}": "命名空间: {{imageStream.metadata.namespace}}",
"Namespace: {{template.metadata.namespace}}": "命名空间: {{template.metadata.namespace}}",
Networking: "网络设置",
"New Image For:": "新的映像：",
"New image is available": "新映像可用",
Next: "下一页",
No: "没有",
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
None: "无",
Normal: "正常",
"Not all containers have health checks": "并非所有容器都有健康检查",
"Not available": "没有可用的",
"Note that this will start a new build.": "注意： 将启动新构建。",
"Note: This setting is browser-specific and will not be maintained across browsers.": "注意: 此设置是特定于浏览器的, 不会跨浏览器维护。",
Notifications: "通知",
"Only the first {{limitListTo}} projects are displayed.": "仅显示第一个{{limitListTo}}项目。",
"Only the previous {{options.tailLines || 5000}} log lines and new log messages will be displayed because of the large log size.": "只有前面的{{options.tailLines || 5000}} 日志行和新日志消息。",
"Open Fullscreen Terminal": "打开全屏终端",
"Open socket on port {{probe.tcpSocket.port}}": "在端口{{probe.tcpSocket.port}}上打开套接字",
OpenShift: "NeokylinKube",
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
Parameters: "参数",
"Passthrough routes can't use the insecure traffic policy": "直通路由不能使用不安全的流量策略",
Password: "密码",
"Password is required.": "密码是必填项",
"Password or Token": "密码或令牌",
"Password or token for Git authentication. Required if a ca.crt or .gitconfig file is not specified.": "Git身份验证的密码或令牌。如果未指定ca.crt或.gitconfig文件，则为必需。",
"Password or token is required.": "密码或令牌是必需的。",
Path: "路径",
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
Pending: "待定",
"Percentage of traffic sent to each service. Drag the slider to adjust the values or": "发送到每项服务的流量百分比。拖动滑块可调整值或",
"Permissions to the mounted volume.": "挂载卷的权限",
"Pick the config source. Its data will be mounted as a volume in the container.": "选择配置源。其数据将作为卷安装在容器中。",
Pipeline: "管道",
"Pipeline Builds": "管道构建",
Pipelines: "管道",
Plan: "计划",
"Please enter a valid name.": "请输入有效的名字",
"Please enter a valid prefix.": "请输入有效的前缀。",
"Pod Metrics": "容器组指标",
"Pod status:": "容器组状态",
Pods: "容器组",
"Policy for traffic on insecure schemes like HTTP.": "HTTP等不安全方案的流量策略。",
Port: "端口",
Ports: "端口",
"Ports:": "端口:",
"Post Lifecycle Hook": "后生命周期挂钩",
"Post hooks execute after the deployment strategy completes.": "在部署策略完成后执行后挂钩。",
"Post-Commit Hooks": "后提交挂钩",
"Pre Lifecycle Hook": "前生命周期挂钩",
"Pre hooks execute before the deployment begins.": "在部署开始之前执行前挂钩。",
Prefix: "前缀",
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
Quota: "配额",
Ratio: "转换率",
"Read Only (ROX)": "只读（ROX）",
"Read only": "只读",
"Readiness Probe": "准备情况探头",
"Readiness Probe:": "准备情况探头",
"Ready:": "准备",
Reason: "原因",
"Reason and": "原因和",
Rebuild: "重建",
"Receiving Traffic": "接收流量",
"Recent Runs": "最近的运行",
"Red Hat OpenShift": "红帽OpenShift",
"Refer to the": "请参阅",
"Rejected by router '{{ingress.routerName}}'": "被路由器 '{{ingress.routerName}}'拒绝",
Reload: "重新加载",
Remove: "删除",
"Remove Item": "删除条目",
"Remove Liveness Probe": "删除活动探测",
"Remove Readiness Probe": "删除准备探测",
"Remove Service": "删除服务",
"Remove Webhook trigger": "删除Webhook触发器",
"Remove build secret": "删除构建秘钥",
"Remove {{service.metadata.name}} from service group": "从服务组中删除{{service.metadata.name}}",
"Remove {{type | upperFirst}} Lifecycle Hook": "删除{{type | upperFirst}}生命周期钩子",
Replace: "替换",
"Replica Sets": "副本集",
Replicas: "副本",
"Replicas can't be negative.": "副本数不能为负数。",
"Replicas must be a whole number.": "副本数必须是整数。",
"Replicas must be an integer value greater than or equal to 0.": "副本数必须是大于或等于0的整数值。",
"Replicas:": "副本：",
"Replication Controllers": "复制控制器",
"Repository:": "仓库:",
Request: "请求",
"Requested Capacity:": "请求的容量：",
"Requests and": "请求和",
"Resource Limits: {{name}}": "资源限制：{{name}}",
"Resource Type": "资源类型",
"Resource limits control how much": "资源限制控制了多少",
Restart: "重启",
"Restart Count:": "重启次数：",
"Restart Policy:": "重启策略",
"Resume Rollouts": "恢复滚动",
"Retry the hook until it succeeds.": "重试钩子直到成功。",
"Return to the": "返回到",
"Revision History Limit:": "修订历史限制：",
"Revision:": "修订版本：",
Roles: "角色",
"Roll Back": "回滚",
Route: "路由",
Routes: "路由",
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
Save: "保存",
"Save partial log for": "保存部分日志",
"Scale Down": "向下扩展",
"Scale down": "向下扩展",
"Scale down {{type}}": "向下扩展 {{type}}",
"Scale replicas automatically based on CPU usage.": "根据CPU使用情况自动扩展副本。",
"Scale replicas manually or automatically based on CPU usage.": "根据CPU使用情况手动或自动扩展副本。",
"Scale up": "向上扩展",
"Scaling may be affected.": "扩展可能会受到影响。",
"Scopes:": "作用域：",
Script: "脚本",
"Script:": "脚本:",
Secret: "秘钥",
"Secret Name": "秘钥名称",
"Secret Type": "秘钥类型",
"Secret for authentication when pulling images from a secured registry.": "从安全注册表中提取映像时的身份验证的秘钥。",
"Secret for authentication when pushing images to a secured registry.": "将映像推送到安全注册表时进行身份验证的秘钥。",
"Secret reference is required.": "秘钥参考是必需的。",
"Secret with credentials for pulling your source code.": "提取源代码的秘钥证书。",
"Secret:": "秘钥:",
Secrets: "秘钥",
"Secrets allow you to authenticate to a private Git repository or a private image registry.": "秘钥允许您对私有Git仓库或私有映像注册表进行身份验证。",
"Secure route": "安全路由",
Security: "安全",
Select: "选择",
"Select a binding to delete from": "选择要从中删除的绑定",
"Select a resource from the list above...": "从上面的列表中选择一个资源..。",
"Select an image stream tag or enter an image name.": "选择映像流标记或输入映像名称。",
"Select from Project": "从项目中选择",
"Select specific keys and paths": "选择特定的键和路径",
"Select storage to use": "选择要使用的存储",
"Select storage to use.": "选择要使用的存储。",
"Select the keys to use and the file paths where each key will be exposed.": "选择要使用的密钥以及将公开每个密钥的文件路径。",
Selector: "选择器",
"Selector:": "选择器",
"Selectors:": "选择器",
Service: "服务",
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
Services: "服务",
"Session Timeout Warning": "会话超时警告",
"Session affinity:": "会话亲和性：",
"Set Home Page": "设置主页",
"Set to the key {{entry.valueFrom.configMapKeyRef.key}} in config map": "设置为配置映射中的键值{{entry.valueFrom.configMapKeyRef.key}}",
"Set to the key {{entry.valueFrom.secretKeyRef.key}} in secret": "键值设置为密钥{{entry.valueFrom.secretKeyRef.key}}",
Severity: "严重程度",
"Shared Access (RWX)": "共享访问（RWX）",
"Show Image Environment Variables": "显示映像环境变量",
"Show Obfuscated Secret": "显示模糊的秘钥",
"Show hidden roles": "显示隐藏的角色",
"Show parameter values": "显示参数值",
"Single User (RWO)": "单用户（RWO）",
Size: "大小",
"Size is required.": "必须填写大小。",
"Some items already exist:": "有些项目已存在：",
"Sort by": "按排序",
Source: "源",
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
Start: "开始",
"Start Build": "开始构建",
"Start Deployment": "开始部署",
"Start Pipeline": "启动管道",
"Start a new build to create an image from": "启动新构建以从中创建映像",
"Started:": "已开始：",
"State:": "状态:",
"Stateful Sets": "状态集",
Status: "状态",
"Status Reason:": "状态原因：",
"Status has not been reported on this quota usage record.  Any resources limited by this quota record can not be allocated.": "尚未报告此配额使用记录的状态。无法分配受此配额记录限制的任何资源。",
"Status:": "状态:",
Stop: "停止",
"Stop Following": "停止跟随",
Storage: "存储",
"Storage Class": "存储类",
"Storage claim: {{template.metadata.name}}": "存储定义：{{template.metadata.name}}",
"Storage classes are set by the administrator to define types of storage the users can select.": "管理员设置存储类以定义用户可以选择的存储类型。",
"Storage quota limit has been reached. You will not be able to create any new storage.": "已达到存储配额限制。您将无法创建任何新存储。",
"Storage quota will be exceeded.": "将超出存储配额。",
Strategy: "策略",
"Strategy Type": "策略类型",
"Strategy:": "策略:",
Subpath: "子路径",
Success: "成功",
"Switch to {{multiline ? 'Single-line' : 'Multiline'}} Editor": "切换到{{multiline ? 'Single-line' : 'Multiline'}}编辑",
"TLS Settings": "TLS设置",
"TLS Termination": "TLS终止",
"TLS certificates for edge and re-encrypt termination. If not specified, the router's default certificate is used.": "用于边缘和重新加密终止的TLS证书。如果未指定，则使用路由器的默认证书。",
"TLS is not enabled.": "TLS 不可用",
Tag: "标记",
"Tag As": "标记为",
"Tag image as": "将标记标记为",
"Tag image if the deployment succeeds": "如果部署成功，则标记映像",
Tags: "标记",
"Tags the current image as an image stream tag if the deployment succeeds.": "如果部署成功，则将当前映像标记为映像流标记。",
"Target CPU percentage must be a number.": "目标CPU百分比必须是一个数字。",
"Target CPU percentage must be a whole number.": "目标CPU百分比必须是整数。",
"Target CPU percentage must be greater than 1.": "目标CPU百分比必须大于1。",
"Target Port": "目标端口",
"Target Port:": "目标端口：",
"Target port for traffic.": "用于通信的目标端口。",
Template: "模板",
Terminal: "终端",
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
'The current value is "{{parameter.value}}", which is not empty.': '当前值为 "{{parameter.value}}", 它不是空的。',
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
Time: "时间",
"Time Range:": "时间范围：",
"Time to wait between polling deployment status after running a pod.": "运行容器组后轮询部署状态之间等待的时间。",
"Time to wait between retrying to run individual pod.": "在重试运行单个pod容器组之间等待的时间。",
Timeout: "超时时间",
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
Traffic: "流量",
"Traffic Split": "流量分割",
"Traffic {{(weightByService[service.metadata.name] / totalWeight) | percent}}": "流量 {{(weightByService[service.metadata.name] / totalWeight) | percent}}",
Trigger: "触发",
"Triggered By:": "触发：",
Triggers: "触发",
"Try It": "尝试一下！",
Type: "类型",
"Type a project name to go to that project.": "键入要转到该项目的项目名称。",
"Type the name of the {{typeDisplayName || (kind | humanizeKind)}} to confirm.": "键入  {{typeDisplayName || (kind | humanizeKind)}} 以确认。",
"Type:": "类型：",
"Type: {{sclass.parameters.type}}": "类型: {{sclass.parameters.type}}",
"Unique name of the new secret.": "新秘钥的唯一名称。",
"Unique name used to identify this volume. If not specified, a volume name is generated.": "用于标识此卷的唯一名称。如果未指定，则生成卷名。",
Unit: "单元",
Unknown: "未知",
"Update Period": "更新周期",
"Update Period:": "更新周期：",
"Update period can't be negative.": "更新周期不能为负。",
"Update the display name and description of your project. The project's unique name cannot be modified.": "更新项目的显示名称和说明。无法修改项目的唯一名称。",
Updated: "已更新",
"Uptime:": "运行时间：",
Usage: "用法",
"Use HTTPS": "使用 HTTPS",
"Use a Jenkinsfile from the source repository or specify the Jenkinsfile content directly in the build configuration.": "使用源仓库中的Jenkinsfile或直接在构建配置中指定Jenkinsfile内容。",
"Use a custom .gitconfig file": "使用自定义. gitconfig 文件",
"Use a custom ca.crt file": "使用自定义 ca. crt 文件",
"Use all keys and values from": "使用中的所有键和值",
"Use label selectors to request storage": "使用标签选择器请求存储",
"Use the following settings from {{replicaSet.metadata.name}} when rolling back:": "回滚时, 请使用 {{replicaSet.metadata.name} 中的以下设置:",
"Use the image for this container as the source of the tag.": "使用此容器的映像作为标记的来源。",
Used: "已使用",
"Used (All Projects)": "已使用（所有项目）",
"Used (This Project)": "已使用（所有项目）",
Username: "用户名",
"Username is required.": "用户名是必须的。",
Value: "值",
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
Volume: "卷",
"Volume File:": "卷文件",
"Volume Name": "卷名称",
"Volume mount in that path already exists. Please choose another mount path.": "该路径中的卷装入已存在。请选择其他安装路径。",
"Volume name already exists. Please choose another name.": "卷名已经存在。请另选一个。",
"Volume names cannot be longer than 63 characters.": "卷名称不能超过63个字符。",
"Volume names may only contain lower-case letters, numbers, and dashes. They may not start or end with a dash.": "卷名称只能包含小写字母，数字和短划线。它们可能无法以短划线开始或结束。",
Volumes: "卷",
"Volumes:": "卷：",
"Waiting for container {{container.name}} to start...": "等待容器{{container.name}}开始......",
Warning: "警告",
"Warning:": "警告：",
"Warning: The deployment's deployment config is missing.": "警告：缺少部署的部署配置。",
Warnings: "警告",
"Webhook Secret Key": "Webhook密钥",
Weight: "权重",
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
Yes: "是",
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
additional: "附加",
"advanced image options.": "高级映像选项",
"advanced strategy options.": "高级策略选项。",
ago: "前",
"allocated unknown size": "分配未知的大小",
"already exists.": "已经存在。",
"an image is pushed to": "映像被推送到",
and: "和",
"and the": "和",
"and {{imageStream.status.tags.length - 4}} others": "和{{imageStream.status.tags.length  -  4}}其他人",
any: "任何",
"authored by {{build.spec.revision.git.author.name}}": "由{{build.spec.revision.git.author.name}}创作",
"authored by {{trigger.githubWebHook.revision.git.author.name || trigger.genericWebHook.revision.git.author.name}},": "由 {{{trigger.githubWebHook.revision.git.author.name trigger.genericWebHook.revision.git.author.name} 创作,",
"build config": "构建配置",
"build config.": "构建配置。",
"build configuration": "构建配置",
"build configuration {{buildConfig.metadata.name}}.": "构建配置{{buildConfig.metadata.name}}。",
change: "更改",
"clear the value": "清除值",
"client tool using the links below. For more information about downloading and installing it, please refer to the": "使用以下链接的客户端工具。有关下载和安装它的更多信息，请参阅",
"client tool.": "客户端工具。",
"command line tools": "命令行工具",
"completed successfully": "成功完成",
"config map": "配置映射:",
"config map {{entry.configMapRef.name}}.": "配置映射 {{entry.configMapRef.name}}。",
console: "控制台",
contain: "包含",
"contains keys that are not valid environment variable names. Only {{ctrl.apiObject.kind | humanizeKind}} keys with valid names will be added as environment variables.": "包含无效环境变量名称的键。只有{{ctrl.apiObject.kind | humanizeKind}}具有有效名称的键将被添加为环境变量。",
"contains keys that are not valid environment variable names. Only {{entry.selectedEnvFrom.kind | humanizeKind}} keys with valid names will be added as environment variables.": "包含不是有效的环境变量名的键。只有  {{entry.selectedEnvFrom.kind | humanizeKind}} 键的有效名称将被添加为环境变量。",
"create an image pull secret": "创建映像并拉取秘钥",
"create storage": "创建存储",
"created from": "创建",
debugging: "调试",
default: "默认",
"deployment config or deployment.": "部署配置或部署。",
"deployment strategy": "部署策略",
"deployment trigger": "部署触发器",
documentation: "文档",
"documentation for instructions about downloading and installing the": "有关下载和安装的说明的文档",
"documentation.": "文档。",
"downward API": "下载API",
"edit the": "编辑",
"edit weights as integers": "将权重编辑为整数",
elapsed: "已经过",
email: "邮箱",
"empty dir": "空目录",
"encountered an error": "遇到错误",
"encountered an error.": "遇到错误。",
error: "错误",
failed: "失败",
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
info: "信息",
"instead.": "代替。",
is: "是",
"is Red Hat's container application platform that allows developers to quickly develop, host, and scale applications in a cloud environment.": "是中标软件容器应用程序平台, 允许开发人员在云环境中快速开发、托管和扩展应用程序。",
"is required to attach to this {{kind | humanizeKind}}, but none are loaded on this project.": "需要附加到此 {{kind | humanizeKind}}， 但没有在此项目上加载任何内容。",
limit: "限制",
"limit reached.": "达到极限。",
"limit.": "限度。",
"max: {{hpa[0].spec.maxReplicas}}": "最大：{{hpa [0] .spec.maxReplicas}}",
"memory a container will consume on a node.": "容器将在节点上使用的内存。",
millicores: "微核",
"min pods, which is": "最小容器组，是",
"min: {{hpa[0].spec.minReplicas || 1}},": "最小：{{hpa [0] .spec.minReplicas || 1}}，",
"namespace. An image or template is required to add content.": "命名空间。添加内容需要映像或模板。",
"no longer exists.": "不再存在",
"no revision information,": "没有修订信息，",
"node's default": "节点的默认值",
none: "无",
"not started": "没有开始",
"o deployments for {{row.apiObject.kind | humanizeKind}}": "o部署 {{row.apiObject.kind | humanizeKind}}",
"of a CPU&nbsp;core.": "一个CPU核心。",
"one of the images referenced by this deployment config changes.": "此部署配置引用的其中一个映像更改。",
openshift: "NeokylinKube",
or: "或",
"or contain": "或包含",
other: "其他",
others: "其他",
password: "密码",
"path elements.": "路径元素。",
"persistent volume claim": "持久化卷定义",
pod: "容器组",
"read-only": "只读的",
"read-write": "读- 写",
reload: "重新加载",
replica: "副本",
"replica count and selector": "副本计数和选择器",
"repository to an OpenShift-visible git account and": "仓库到NeokylinKube可见的git帐户和",
request: "请求",
"request.": "请求。",
routes: "路由",
"running for": "用于运行",
"runs as the": "运行以",
seconds: "秒",
"seconds.": "秒。",
secret: "秘钥",
"secret {{entry.secretRef.name}}.": "秘钥 {{entry.secretRef.name}}。",
"select specific containers": "选择特定的容器",
services: "服务",
"services in your project to expose with a route.": "项目中的服务以路由公开。",
"set. Autoscaling will not work without a CPU": "设置。如果没有 cpu, 自动扩展将无法正常工作",
"source repository": "源仓库",
started: "已开始",
"tab, or run the following command:": "选项卡，或运行以下命令：",
"the log to see new messages.": "日志以查看新消息。",
"this route to enable secure network traffic.": "此路由可启用安全网络流量。",
to: "到",
"to 0 replicas? This will stop all pods for the {{type}}.": "到0个副本？这将停止 {{type}} 的所有容器组。",
"to ensure your application is running correctly.": "确保您的应用程序正常运行。",
"to point to your fork.": "指向你的分叉。",
"to see what stages will run.": "看看会运行哪些阶段。",
"to volume": "到卷",
"to {{build.status.completionTimestamp  | date : 'medium'}}": "到 {{build.status.completionTimestamp  | date : 'medium'}}",
unknown: "未知",
"user which might not be permitted by your cluster administrator.": "您的群集管理员可能不允许的用户。",
username: "用戶名",
"using persistent volumes": "使用持久卷",
"using storage class {{pvc | storageClass}}": "使用存储类{{pvc | storageClass}}",
"using the following payload URL and specifying a": "使用以下有效内容URL并指定",
"waited for": "等待",
"waiting for": "正在等待",
"waiting for allocation,": "等待分配,",
"waiting for {{pvc.spec.resources.requests['storage'] | usageWithUnits: 'storage'}} allocation,": "正在等待 {{pvc.spec.resources.requests['storage'] | usageWithUnits: 'storage'}}分配，",
warning: "警告",
warnings: "警告",
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
'{{$ctrl.showSecret ? "Hide" : "Reveal"}} Secret': '{{$ctrl.showSecret ? "隐藏" : "显示"}} Secret',
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
'{{updateTemplate ? "This will overwrite the current version of the template." : "Save the template to the project. This will make the template available to anyone who can view the project."}}': "{{updateTemplate？ “这将覆盖当前版本的模板。” ：“将模板保存到项目中。这将使模板可供任何可以查看项目的人使用。”}}",
'{{updateTemplate ? "Update" : "Add"}} Template': "{{updateTemplate？ “更新”：“添加”}}模板",
'{{updateTemplate ? "Update" : "Save"}} template': "{{updateTemplate？ “更新”：“保存”}}模板",
Applications: "应用",
"Business Process Services": "业务流程服务",
Catalog: "目录",
"Continuous Integration & Deployment": "持续集成和部署",
"Data Stores": "数据仓库",
Integration: "集成",
Languages: "语言",
Messaging: "消息",
Monitoring: "监控",
Overview: "概述",
Resources: "资源",
"Single Sign-On": "单点登录",
Technologies: "技术",
Uncategorized: "未分类",
"Select an item to add to the current project": "选择要添加到当前项目的项"
});
} ]), pluginLoader.addModule("openshiftConsole"), angular.module("openshiftConsole").factory("HawtioExtension", [ "extensionRegistry", function(e) {
return console.warn("HawtioExtension.add() has been deprecated.  Please migrate to angular-extension-registry https://github.com/openshift/angular-extension-registry"), {
add: function(t, n) {
e.add(t, function(e) {
return {
type: "dom",
node: n(e)
};
});
}
};
} ]), angular.module("openshiftConsole").factory("BrowserStore", [ function() {
var e = {
local: window.localStorage,
session: window.sessionStorage
};
return {
saveJSON: function(t, n, a) {
return e[t].setItem("openshift/" + n, JSON.stringify(a));
},
loadJSON: function(t, n) {
return JSON.parse(e[t].getItem("openshift/" + n) || "{}");
}
};
} ]), angular.module("openshiftConsole").factory("APIDiscovery", [ "LOGGING_URL", "METRICS_URL", "$q", "$filter", function(e, t, n, a) {
return {
getLoggingURL: function(t) {
var r = e, o = a("annotation")(t, "loggingUIHostname");
return o && (r = "https://" + o), n.when(r);
},
getMetricsURL: function() {
return n.when(t);
}
};
} ]), angular.module("openshiftConsole").service("ApplicationGenerator", [ "DataService", "APIService", "Logger", "$parse", "$q", function(e, t, n, a, r) {
var o = {}, i = function(e) {
return _.isArray(e) ? e : _.map(e, function(e, t) {
return {
name: t,
value: e
};
});
};
return o._generateSecret = function() {
function e() {
return Math.floor(65536 * (1 + Math.random())).toString(16).substring(1);
}
return e() + e() + e() + e();
}, o.parsePorts = function(e) {
return function(t) {
var r = [];
return angular.forEach(t, function(t, o) {
var i = o.split("/");
1 === i.length && i.push("tcp");
var s = parseInt(i[0], 10);
isNaN(s) ? n.warn("Container port " + i[0] + " is not a number for image " + a("metadata.name")(e)) : r.push({
containerPort: s,
protocol: i[1].toUpperCase()
});
}), r.sort(function(e, t) {
return e.containerPort - t.containerPort;
}), r;
}(a("dockerImageMetadata.Config.ExposedPorts")(e) || a("dockerImageMetadata.ContainerConfig.ExposedPorts")(e) || []);
}, o.generate = function(e) {
var t = o.parsePorts(e.image);
e.annotations["openshift.io/generated-by"] = "OpenShiftWebConsole";
var n;
null !== e.buildConfig.sourceUrl && (n = {
name: e.name,
tag: "latest",
kind: "ImageStreamTag",
toString: function() {
return this.name + ":" + this.tag;
}
});
var a = {
imageStream: o._generateImageStream(e),
buildConfig: o._generateBuildConfig(e, n, e.labels),
deploymentConfig: o._generateDeploymentConfig(e, n, t, e.labels)
};
e.scaling.autoscale && (a.hpa = o._generateHPA(e, a.deploymentConfig));
var r = o._generateService(e, e.name, t);
return r && (a.service = r, a.route = o._generateRoute(e, e.name, a.service.metadata.name)), a;
}, o.createRoute = function(e, t, n) {
return o._generateRoute({
labels: n || {},
routing: angular.extend({
include: !0
}, e)
}, e.name, t);
}, o._generateRoute = function(e, t, n) {
if (!e.routing.include) return null;
var a = {
kind: "Route",
apiVersion: "v1",
metadata: {
name: t,
labels: e.labels,
annotations: e.annotations
},
spec: {
to: {
kind: "Service",
name: n
},
wildcardPolicy: "None"
}
}, r = e.routing.host;
r && (r.startsWith("*.") ? (a.spec.wildcardPolicy = "Subdomain", a.spec.host = "wildcard" + r.substring(1)) : a.spec.host = r), e.routing.path && (a.spec.path = e.routing.path), e.routing.targetPort && (a.spec.port = {
targetPort: e.routing.targetPort
});
var o = e.routing.tls;
return o && o.termination && (a.spec.tls = {
termination: o.termination
}, o.insecureEdgeTerminationPolicy && (a.spec.tls.insecureEdgeTerminationPolicy = o.insecureEdgeTerminationPolicy), "passthrough" !== o.termination && (o.certificate && (a.spec.tls.certificate = o.certificate), o.key && (a.spec.tls.key = o.key), o.caCertificate && (a.spec.tls.caCertificate = o.caCertificate), o.destinationCACertificate && "reencrypt" === o.termination && (a.spec.tls.destinationCACertificate = o.destinationCACertificate))), a;
}, o._generateDeploymentConfig = function(e, t, n) {
var a = i(e.deploymentConfig.envVars), r = angular.copy(e.labels);
r.deploymentconfig = e.name;
var o, s = {
image: t.toString(),
name: e.name,
ports: n,
env: a,
resources: _.get(e, "container.resources")
};
o = e.scaling.autoscaling ? e.scaling.minReplicas || 1 : e.scaling.replicas;
var c = {
apiVersion: "v1",
kind: "DeploymentConfig",
metadata: {
name: e.name,
labels: e.labels,
annotations: e.annotations
},
spec: {
replicas: o,
selector: {
deploymentconfig: e.name
},
triggers: [],
template: {
metadata: {
labels: r
},
spec: {
containers: [ s ]
}
}
}
};
return c.spec.triggers.push({
type: "ImageChange",
imageChangeParams: {
automatic: !!e.deploymentConfig.deployOnNewImage,
containerNames: [ e.name ],
from: {
kind: t.kind,
name: t.toString()
}
}
}), e.deploymentConfig.deployOnConfigChange && c.spec.triggers.push({
type: "ConfigChange"
}), c;
}, o._generateHPA = function(e, t) {
return {
apiVersion: "autoscaling/v1",
kind: "HorizontalPodAutoscaler",
metadata: {
name: e.name,
labels: e.labels,
annotations: e.annotations
},
spec: {
scaleTargetRef: {
kind: "DeploymentConfig",
name: t.metadata.name,
apiVersion: "apps.openshift.io/v1"
},
minReplicas: e.scaling.minReplicas,
maxReplicas: e.scaling.maxReplicas,
targetCPUUtilizationPercentage: e.scaling.targetCPU
}
};
}, o._generateBuildConfig = function(e, t) {
var n = i(e.buildConfig.envVars), a = [ {
generic: {
secret: o._generateSecret()
},
type: "Generic"
} ];
e.buildConfig.buildOnSourceChange && a.push({
github: {
secret: o._generateSecret()
},
type: "GitHub"
}), e.buildConfig.buildOnImageChange && a.push({
imageChange: {},
type: "ImageChange"
}), e.buildConfig.buildOnConfigChange && a.push({
type: "ConfigChange"
});
var r = new URI(e.buildConfig.sourceUrl), s = r.fragment();
s || (s = "master"), r.fragment("");
var c = r.href(), l = {
apiVersion: "v1",
kind: "BuildConfig",
metadata: {
name: e.name,
labels: e.labels,
annotations: e.annotations
},
spec: {
output: {
to: {
name: t.toString(),
kind: t.kind
}
},
source: {
git: {
ref: e.buildConfig.gitRef || s,
uri: c
},
type: "Git"
},
strategy: {
type: "Source",
sourceStrategy: {
from: {
kind: "ImageStreamTag",
name: e.imageName + ":" + e.imageTag,
namespace: e.namespace
},
env: n
}
},
triggers: a
}
};
return _.get(e, "buildConfig.secrets.gitSecret[0].name") && (l.spec.source.sourceSecret = _.head(e.buildConfig.secrets.gitSecret)), e.buildConfig.contextDir && (l.spec.source.contextDir = e.buildConfig.contextDir), l;
}, o._generateImageStream = function(e) {
return {
apiVersion: "v1",
kind: "ImageStream",
metadata: {
name: e.name,
labels: e.labels,
annotations: e.annotations
}
};
}, o.getServicePort = function(e) {
return {
port: e.containerPort,
targetPort: e.containerPort,
protocol: e.protocol,
name: (e.containerPort + "-" + e.protocol).toLowerCase()
};
}, o._generateService = function(e, t, n) {
return n && n.length ? {
kind: "Service",
apiVersion: "v1",
metadata: {
name: t,
labels: e.labels,
annotations: e.annotations
},
spec: {
selector: {
deploymentconfig: e.name
},
ports: _.map(n, o.getServicePort)
}
} : null;
}, o.ifResourcesDontExist = function(n, a) {
function o() {
0 === l && (s.length > 0 ? i.reject({
nameTaken: !0
}) : i.resolve({
nameTaken: !1
}));
}
var i = r.defer(), s = [], c = [], l = n.length;
return n.forEach(function(n) {
var r = t.objectToResourceGroupVersion(n);
return r ? t.apiInfo(r) ? void e.get(r, n.metadata.name, {
namespace: a
}, {
errorNotification: !1
}).then(function(e) {
s.push(e), l--, o();
}, function(e) {
c.push(e), l--, o();
}) : (c.push({
data: {
message: t.unsupportedObjectKindOrVersion(n)
}
}), l--, void o()) : (c.push({
data: {
message: t.invalidObjectKindOrVersion(n)
}
}), l--, void o());
}), i.promise;
}, o;
} ]), angular.module("openshiftConsole").service("Navigate", [ "$location", "$window", "$timeout", "annotationFilter", "LabelFilter", "$filter", "APIService", function(e, t, n, a, r, o, i) {
var s = o("annotation"), c = o("buildConfigForBuild"), l = o("isJenkinsPipelineStrategy"), u = o("displayName"), d = function(e, t) {
return _.get(t, "isPipeline") ? "pipelines" : _.isObject(e) && l(e) ? "pipelines" : "builds";
};
return {
toErrorPage: function(n, a, r) {
var o = URI("error").query({
error_description: n,
error: a
}).toString();
r ? t.location.href = o : e.url(o).replace();
},
toProjectOverview: function(t) {
e.path(this.projectOverviewURL(t));
},
projectOverviewURL: function(e) {
return "project/" + encodeURIComponent(e) + "/overview";
},
toProjectList: function() {
e.path("projects");
},
membershipURL: function(e) {
return "project/" + encodeURIComponent(e) + "/membership";
},
toProjectMembership: function(t) {
e.path(this.membershipURL(t));
},
catalogURL: function(e) {
var t = angular.isString(e) ? e : _.get(e, "metadata.name");
return t ? "project/" + encodeURIComponent(t) + "/catalog" : "catalog";
},
toProjectCatalog: function(t, n) {
var a = e.path(this.catalogURL(t));
n && a.search(n);
},
quotaURL: function(e) {
return "project/" + encodeURIComponent(e) + "/quota";
},
createFromImageURL: function(e, t, n, a) {
return URI.expand("project/{project}/create/fromimage{?q*}", {
project: n,
q: angular.extend({
imageStream: e.metadata.name,
imageTag: t,
namespace: e.metadata.namespace,
displayName: u(e)
}, a || {})
}).toString();
},
createFromTemplateURL: function(e, t, n) {
return URI.expand("project/{project}/create/fromtemplate{?q*}", {
project: t,
q: angular.extend({
template: e.metadata.name,
namespace: e.metadata.namespace
}, n || {})
}).toString();
},
toNextSteps: function(t, n, a) {
var r = {
name: t
};
_.isObject(a) && _.extend(r, a), e.path("project/" + encodeURIComponent(n) + "/create/next").search(r);
},
toPodsForDeployment: function(e, t) {
1 !== _.size(t) ? this.toResourceURL(e) : this.toResourceURL(_.sample(t));
},
resourceURL: function(e, t, n, a, r) {
if (a = a || "browse", !(e && (e.metadata || t && n))) return null;
t || (t = e.kind), n || (n = e.metadata.namespace);
var s = e;
e.metadata && (s = e.metadata.name);
var c = URI("").segment("project").segmentCoded(n).segment(a);
switch (t) {
case "Build":
var l = o("buildConfigForBuild")(e), u = d(e, r);
l ? c.segment(u).segmentCoded(l).segmentCoded(s) : c.segment(u + "-noconfig").segmentCoded(s);
break;

case "BuildConfig":
c.segment(d(e, r)).segmentCoded(s);
break;

case "ConfigMap":
c.segment("config-maps").segmentCoded(s);
break;

case "Deployment":
c.segment("deployment").segmentCoded(s);
break;

case "DeploymentConfig":
c.segment("dc").segmentCoded(s);
break;

case "ReplicaSet":
c.segment("rs").segmentCoded(s);
break;

case "ReplicationController":
c.segment("rc").segmentCoded(s);
break;

case "ImageStream":
c.segment("images").segmentCoded(s);
break;

case "ImageStreamTag":
var m = s.indexOf(":");
c.segment("images").segmentCoded(s.substring(0, m)).segmentCoded(s.substring(m + 1));
break;

case "ServiceInstance":
c.segment("service-instances").segmentCoded(s);
break;

case "StatefulSet":
c.segment("stateful-sets").segmentCoded(s);
break;

case "PersistentVolumeClaim":
case "Pod":
case "Route":
case "Secret":
case "Service":
c.segment(i.kindToResource(t)).segmentCoded(s);
break;

default:
var p;
if (e.metadata) p = i.objectToResourceGroupVersion(e); else if (_.get(r, "apiVersion")) {
var g = i.kindToResource(t), f = i.parseGroupVersion(r.apiVersion);
f.resource = g, p = i.toResourceGroupVersion(f);
} else p = i.toResourceGroupVersion(i.kindToResource(t));
if (!i.apiInfo(p)) return null;
c.segment("other").search({
kind: t,
group: p.group
});
}
return _.get(r, "tab") && c.setSearch("tab", r.tab), c.toString();
},
toResourceURL: function(t) {
e.url(this.resourceURL(t));
},
configURLForResource: function(e, t) {
var n, a, r = _.get(e, "kind"), o = _.get(e, "metadata.namespace");
if (!r || !o) return null;
switch (r) {
case "Build":
return (n = c(e)) ? this.resourceURL(n, "BuildConfig", o, t, {
isPipeline: l(e)
}) : null;

case "ReplicationController":
return (a = s(e, "deploymentConfig")) ? this.resourceURL(a, "DeploymentConfig", o, t) : null;
}
return null;
},
resourceListURL: function(e, t) {
var n = {
builds: "builds",
buildconfigs: "builds",
configmaps: "config-maps",
deployments: "deployments",
deploymentconfigs: "deployments",
imagestreams: "images",
pods: "pods",
replicasets: "deployments",
replicationcontrollers: "deployments",
routes: "routes",
secrets: "secrets",
services: "services",
serviceinstances: "service-instances",
persistentvolumeclaims: "storage",
statefulsets: "stateful-sets"
};
return URI.expand("project/{projectName}/browse/{browsePath}", {
projectName: t,
browsePath: n[e]
}).toString();
},
toResourceList: function(t, n) {
e.url(this.resourceListURL(t, n));
},
yamlURL: function(e, t) {
if (!e) return "";
var n = i.parseGroupVersion(e.apiVersion);
return URI.expand("project/{projectName}/edit/yaml?kind={kind}&name={name}&group={group}&returnURL={returnURL}", {
projectName: e.metadata.namespace,
kind: e.kind,
name: e.metadata.name,
group: n.group || "",
returnURL: t || ""
}).toString();
},
healthCheckURL: function(e, t, n, a) {
return URI.expand("project/{projectName}/edit/health-checks?kind={kind}&name={name}&group={group}", {
projectName: e,
kind: t,
name: n,
group: a || ""
}).toString();
}
};
} ]), angular.module("openshiftConsole").service("NameGenerator", function() {
return {
suggestFromSourceUrl: function(e) {
var t = e.substr(e.lastIndexOf("/") + 1, e.length), n = t.indexOf(".");
return -1 !== n && (t = t.substr(0, n)), t.split("#")[0];
}
};
}), angular.module("openshiftConsole").factory("TaskList", [ "$timeout", function(e) {
function t() {
this.tasks = [];
}
var n = new t();
return t.prototype.add = function(t, a, r, o) {
var i = {
status: "started",
titles: t,
helpLinks: a,
namespace: r
};
this.tasks.push(i), o().then(function(t) {
i.status = "completed", i.hasErrors = t.hasErrors || !1, i.alerts = t.alerts || [], i.hasErrors || e(function() {
n.deleteTask(i);
}, 6e4);
});
}, t.prototype.taskList = function() {
return this.tasks;
}, t.prototype.deleteTask = function(e) {
var t = n.tasks.indexOf(e);
t >= 0 && this.tasks.splice(t, 1);
}, t.prototype.clear = function() {
n.tasks = [];
}, n;
} ]), angular.module("openshiftConsole").factory("ImageStreamResolver", [ "$q", "APIService", "DataService", function(e, t, n) {
function a() {}
var r = t.getPreferredVersion("imagestreamimages");
return a.prototype.fetchReferencedImageStreamImages = function(t, a, o, i) {
var s = {};
return angular.forEach(t, function(e) {
angular.forEach(e.spec.containers, function(e) {
var t = e.image;
if (t && !a[t] && !s[t]) {
var c = o[t];
if (c) {
var l = c.split("@"), u = n.get(r, c, i);
u.then(function(e) {
if (e && e.image) {
var n = angular.copy(e.image);
n.imageStreamName = l[0], n.imageStreamNamespace = i.project.metadata.name, a[t] = n;
}
}), s[t] = u;
}
}
});
}), e.all(s);
}, a.prototype.buildDockerRefMapForImageStreams = function(e, t) {
angular.forEach(e, function(e) {
angular.forEach(e.status.tags, function(n) {
angular.forEach(n.items, function(n) {
n.image && (t[n.dockerImageReference] = e.metadata.name + "@" + n.image);
});
});
});
}, new a();
} ]), angular.module("openshiftConsole").factory("ContainerWebSocket", [ "API_CFG", "$ws", function(e, t) {
return function(n, a) {
return 0 === n.indexOf("/") && (n = ("http:" === window.location.protocol ? "ws://" : "wss://") + e.openshift.hostPort + n), t({
url: n,
method: "WATCH",
protocols: a,
auth: {}
});
};
} ]), angular.module("openshiftConsole").factory("BaseHref", [ "$document", function(e) {
return e.find("base").attr("href") || "/";
} ]), angular.module("openshiftConsole").factory("BuildsService", [ "$filter", "$q", "APIService", "DataService", "Navigate", "NotificationsService", function(e, t, n, a, r, o) {
var i = n.getPreferredVersion("buildconfigs/instantiate"), s = n.getPreferredVersion("builds/clone"), c = e("annotation"), l = e("buildConfigForBuild"), u = e("getErrorDetails"), d = e("isIncompleteBuild"), m = e("isJenkinsPipelineStrategy"), p = e("isNewerResource"), g = function(e) {
var t = c(e, "buildNumber") || parseInt(e.metadata.name.match(/(\d+)$/), 10);
return isNaN(t) ? null : t;
}, f = function(e, t) {
var n = g(e);
return t && n ? t + " #" + n : e.metadata.name;
}, h = function(e) {
return "true" === c(e, "openshift.io/build-config.paused");
}, v = function(e) {
return e.status.startTimestamp || e.metadata.creationTimestamp;
}, y = function(e) {
return _.round(e / 1e3 / 1e3);
}, b = e("imageObjectRef"), S = function(e) {
var t = c(e, "jenkinsStatus");
if (!t) return null;
try {
return JSON.parse(t);
} catch (e) {
return Logger.error("Could not parse Jenkins status as JSON", t), null;
}
};
return {
startBuild: function(e) {
var s = m(e) ? "pipeline" : "build", c = {
kind: "BuildRequest",
apiVersion: n.toAPIVersion(i),
metadata: {
name: e.metadata.name
}
}, l = {
namespace: e.metadata.namespace
};
return a.create(i, e.metadata.name, c, l).then(function(t) {
var n, a, i = f(t, e.metadata.name), c = _.get(e, "spec.runPolicy");
"Serial" === c || "SerialLatestOnly" === c ? (n = _.capitalize(s) + " " + i + " successfully queued.", a = "Builds for " + e.metadata.name + " are configured to run one at a time.") : n = _.capitalize(s) + " " + i + " successfully created.", o.addNotification({
type: "success",
message: n,
details: a,
links: [ {
href: r.resourceURL(t),
label: "View Build"
} ]
});
}, function(e) {
return o.addNotification({
type: "error",
message: "An error occurred while starting the " + s + ".",
details: u(e)
}), t.reject(e);
});
},
cancelBuild: function(e, r) {
var i = m(e) ? "pipeline" : "build", s = f(e, r), c = {
namespace: e.metadata.namespace
}, l = angular.copy(e), d = n.objectToResourceGroupVersion(l);
return l.status.cancelled = !0, a.update(d, l.metadata.name, l, c).then(function() {
o.addNotification({
type: "success",
message: _.capitalize(i) + " " + s + " successfully cancelled."
});
}), function(e) {
return o.addNotification({
type: "error",
message: "An error occurred cancelling " + i + " " + s + ".",
details: u(e)
}), t.reject(e);
};
},
cloneBuild: function(e, i) {
var c = m(e) ? "pipeline" : "build", l = f(e, i), d = {
kind: "BuildRequest",
apiVersion: n.toAPIVersion(s),
metadata: {
name: e.metadata.name
}
}, p = {
namespace: e.metadata.namespace
};
return a.create(s, e.metadata.name, d, p).then(function(e) {
var t = f(e, i);
o.addNotification({
type: "success",
message: _.capitalize(c) + " " + l + " is being rebuilt as " + t + ".",
links: [ {
href: r.resourceURL(e),
label: "View Build"
} ]
});
}, function(e) {
return o.addNotification({
type: "error",
message: "An error occurred while rerunning " + c + " " + l + ".",
details: u(e)
}), t.reject();
});
},
isPaused: h,
canBuild: function(e) {
return !!e && !e.metadata.deletionTimestamp && !h(e);
},
usesDeploymentConfigs: function(e) {
var t = c(e, "pipeline.alpha.openshift.io/uses");
if (!t) return [];
try {
t = JSON.parse(t);
} catch (e) {
return void Logger.warn('Could not parse "pipeline.alpha.openshift.io/uses" annotation', e);
}
var n = [];
return _.each(t, function(t) {
t.name && (t.namespace && t.namespace !== _.get(e, "metadata.namespace") || "DeploymentConfig" === t.kind && n.push(t.name));
}), n;
},
validatedBuildsForBuildConfig: function(e, t) {
return _.pickBy(t, function(t) {
var n = c(t, "buildConfig");
return !n || n === e;
});
},
latestBuildByConfig: function(e, t) {
var n = {};
return _.each(e, function(e) {
var a = l(e) || "";
t && !t(e) || p(e, n[a]) && (n[a] = e);
}), n;
},
getBuildNumber: g,
getBuildDisplayName: f,
getStartTimestsamp: v,
getDuration: function(e) {
var t = _.get(e, "status.duration");
if (t) return y(t);
var n = v(e), a = e.status.completionTimestamp;
return n && a ? moment(a).diff(moment(n)) : 0;
},
incompleteBuilds: function(e) {
return _.map(e, function(e) {
return d(e);
});
},
completeBuilds: function(e) {
return _.map(e, function(e) {
return !d(e);
});
},
lastCompleteByBuildConfig: function(t) {
return _.reduce(t, function(t, n) {
if (d(n)) return t;
var a = e("annotation")(n, "buildConfig");
return p(n, t[a]) && (t[a] = n), t;
}, {});
},
interestingBuilds: function(t) {
var n = {};
return _.filter(t, function(t) {
if (d(t)) return !0;
var a = e("annotation")(t, "buildConfig");
p(t, n[a]) && (n[a] = t);
}).concat(_.map(n, function(e) {
return e;
}));
},
groupBuildConfigsByOutputImage: function(e) {
var t = {};
return _.each(e, function(e) {
var n = _.get(e, "spec.output.to"), a = b(n, e.metadata.namespace);
a && (t[a] = t[a] || [], t[a].push(e));
}), t;
},
sortBuilds: function(e, t) {
var n = function(e, n) {
var a, r, o = g(e), i = g(n);
return o || i ? o ? i ? t ? i - o : o - i : t ? -1 : 1 : t ? 1 : -1 : (a = _.get(e, "metadata.name", ""), r = _.get(n, "metadata.name", ""), t ? r.localeCompare(a) : a.localeCompare(r));
};
return _.toArray(e).sort(function(e, a) {
var r = _.get(e, "metadata.creationTimestamp", ""), o = _.get(a, "metadata.creationTimestamp", "");
return r === o ? n(e, a) : t ? o.localeCompare(r) : r.localeCompare(o);
});
},
getJenkinsStatus: S,
getCurrentStage: function(e) {
var t = S(e), n = _.get(t, "stages", []);
return _.last(n);
}
};
} ]), angular.module("openshiftConsole").factory("DeploymentsService", [ "$filter", "$q", "APIService", "DataService", "LabelFilter", "NotificationsService", function(e, t, n, a, r, o) {
function i() {}
var s = n.getPreferredVersion("deploymentconfigs/instantiate"), c = n.getPreferredVersion("deploymentconfigs/rollback"), l = n.getPreferredVersion("pods"), u = n.getPreferredVersion("replicationcontrollers"), d = e("annotation");
i.prototype.startLatestDeployment = function(t, r) {
var i = {
kind: "DeploymentRequest",
apiVersion: n.toAPIVersion(s),
name: t.metadata.name,
latest: !0,
force: !0
};
a.create(s, t.metadata.name, i, r).then(function(e) {
o.addNotification({
type: "success",
message: "Deployment #" + e.status.latestVersion + " of " + t.metadata.name + " has started."
});
}, function(t) {
o.addNotification({
type: "error",
message: "An error occurred while starting the deployment.",
details: e("getErrorDetails")(t)
});
});
}, i.prototype.retryFailedDeployment = function(t, r, i) {
var s = angular.copy(t), c = n.objectToResourceGroupVersion(t), u = t.metadata.name, m = d(t, "deploymentConfig");
a.list(l, r, function(t) {
var n = t.by("metadata.name");
angular.forEach(n, function(t) {
var n = e("annotationName")("deployerPodFor");
t.metadata.labels[n] === u && a.delete(l, t.metadata.name, i).then(function() {
Logger.info("Deployer pod " + t.metadata.name + " deleted");
}, function(t) {
i.alerts = i.alerts || {}, i.alerts.retrydeployer = {
type: "error",
message: "An error occurred while deleting the deployer pod.",
details: e("getErrorDetails")(t)
};
});
});
});
var p = e("annotationName")("deploymentStatus"), g = e("annotationName")("deploymentStatusReason"), f = e("annotationName")("deploymentCancelled");
s.metadata.annotations[p] = "New", delete s.metadata.annotations[g], delete s.metadata.annotations[f], a.update(c, u, s, r).then(function() {
o.addNotification({
type: "success",
message: "Retrying deployment " + u + " of " + m + "."
});
}, function(t) {
o.addNotification({
type: "error",
message: "An error occurred while retrying the deployment.",
details: e("getErrorDetails")(t)
});
});
}, i.prototype.rollbackToDeployment = function(t, r, i, s, l) {
var u = t.metadata.name, m = d(t, "deploymentConfig"), p = {
apiVersion: n.toAPIVersion(c),
kind: "DeploymentConfigRollback",
name: m,
spec: {
from: {
name: u
},
includeTemplate: !0,
includeReplicationMeta: r,
includeStrategy: i,
includeTriggers: s
}
};
a.create(c, m, p, l).then(function(t) {
var r = n.objectToResourceGroupVersion(t);
a.update(r, m, t, l).then(function(e) {
o.addNotification({
type: "success",
message: "Deployment #" + e.status.latestVersion + " is rolling back " + m + " to " + u + "."
});
}, function(t) {
o.addNotification({
id: "rollback-deployment-error",
type: "error",
message: "An error occurred while rolling back the deployment.",
details: e("getErrorDetails")(t)
});
});
}, function(t) {
o.addNotification({
id: "rollback-deployment-error",
type: "error",
message: "An error occurred while rolling back the deployment.",
details: e("getErrorDetails")(t)
});
});
}, i.prototype.cancelRunningDeployment = function(t, n) {
var r = t.metadata.name, i = e("annotation")(t, "deploymentConfig"), s = angular.copy(t), c = e("annotationName")("deploymentCancelled"), l = e("annotationName")("deploymentStatusReason");
s.metadata.annotations[c] = "true", s.metadata.annotations[l] = "The deployment was cancelled by the user", a.update(u, r, s, n).then(function() {
o.addNotification({
type: "success",
message: "Cancelled deployment " + r + " of " + i + "."
});
}, function(t) {
o.addNotification({
id: "cancel-deployment-error",
type: "error",
message: "An error occurred while cancelling the deployment.",
details: e("getErrorDetails")(t)
});
});
}, i.prototype.associateDeploymentsToDeploymentConfig = function(t, n, a) {
var o = {}, i = r.getLabelSelector();
return angular.forEach(t, function(t, r) {
var s = e("annotation")(t, "deploymentConfig");
(!a || n && n[s] || i.matches(t)) && (o[s = s || ""] = o[s] || {}, o[s][r] = t);
}), angular.forEach(n, function(e, t) {
o[t] = o[t] || {};
}), o;
}, i.prototype.deploymentBelongsToConfig = function(t, n) {
return !(!t || !n) && n === e("annotation")(t, "deploymentConfig");
}, i.prototype.associateRunningDeploymentToDeploymentConfig = function(t) {
var n = {};
return angular.forEach(t, function(t, a) {
n[a] = {}, angular.forEach(t, function(t, r) {
var o = e("deploymentStatus")(t);
"New" !== o && "Pending" !== o && "Running" !== o || (n[a][r] = t);
});
}), n;
}, i.prototype.getActiveDeployment = function(t) {
var n = e("deploymentIsInProgress"), a = e("annotation"), r = null;
return _.each(t, function(e) {
if (n(e)) return r = null, !1;
"Complete" === a(e, "deploymentStatus") && (!r || r.metadata.creationTimestamp < e.metadata.creationTimestamp) && (r = e);
}), r;
}, i.prototype.getRevision = function(e) {
return d(e, "deployment.kubernetes.io/revision");
}, i.prototype.isActiveReplicaSet = function(e, t) {
var n = this.getRevision(e), a = this.getRevision(t);
return !(!n || !a) && n === a;
}, i.prototype.getActiveReplicaSet = function(e, t) {
var n = this.getRevision(t);
if (!n) return null;
var a = this;
return _.find(e, function(e) {
return a.getRevision(e) === n;
});
}, i.prototype.getScaleResource = function(e) {
var t = {
resource: n.kindToResource(e.kind) + "/scale"
};
switch (e.kind) {
case "DeploymentConfig":
break;

case "Deployment":
case "ReplicaSet":
case "ReplicationController":
t.group = "extensions";
break;

default:
return null;
}
return t;
}, i.prototype.scale = function(e, n) {
var r = this.getScaleResource(e);
if (!r) return t.reject({
data: {
message: "Cannot scale kind " + e.kind + "."
}
});
var o = {
apiVersion: "extensions/v1beta1",
kind: "Scale",
metadata: {
name: e.metadata.name,
namespace: e.metadata.namespace,
creationTimestamp: e.metadata.creationTimestamp
},
spec: {
replicas: n
}
};
return a.update(r, e.metadata.name, o, {
namespace: e.metadata.namespace
});
};
var m = function(e, t) {
var n = _.get(t, [ e ]);
return !_.isEmpty(n);
}, p = function(e, t) {
var n = _.get(t, [ e ]);
return !_.isEmpty(n);
};
return i.prototype.isScalable = function(e, t, n, a, r) {
if (p(e.metadata.name, a)) return !1;
var o = d(e, "deploymentConfig");
return !o || !!t && (!t[o] || !m(o, n) && _.get(r, [ o, "metadata", "name" ]) === e.metadata.name);
}, i.prototype.groupByDeploymentConfig = function(t) {
var n = {};
return _.each(t, function(t) {
var a = e("annotation")(t, "deploymentConfig") || "";
_.set(n, [ a, t.metadata.name ], t);
}), n;
}, i.prototype.sortByDeploymentVersion = function(e, t) {
return _.toArray(e).sort(function(e, n) {
var a, r, o = parseInt(d(e, "deploymentVersion"), 10), i = parseInt(d(n, "deploymentVersion"), 10);
return _.isFinite(o) || _.isFinite(i) ? o ? i ? t ? i - o : o - i : t ? -1 : 1 : t ? 1 : -1 : (a = _.get(e, "metadata.name", ""), r = _.get(n, "metadata.name", ""), t ? r.localeCompare(a) : a.localeCompare(r));
});
}, i.prototype.sortByRevision = function(e) {
var t = this, n = function(e) {
var n = t.getRevision(e);
if (!n) return null;
var a = parseInt(n, 10);
return isNaN(a) ? null : a;
};
return _.toArray(e).sort(function(e, t) {
var a = n(e), r = n(t);
return a || r ? a ? r ? r - a : -1 : 1 : e.metadata.name.localeCompare(t.metadata.name);
});
}, i.prototype.setPaused = function(e, t, r) {
var o = angular.copy(e), i = n.objectToResourceGroupVersion(e);
return _.set(o, "spec.paused", t), a.update(i, e.metadata.name, o, r);
}, new i();
} ]), angular.module("openshiftConsole").factory("ImageStreamsService", function() {
return {
tagsByName: function(e) {
var t = {};
return angular.forEach(e.spec.tags, function(n) {
t[n.name] = t[n.name] || {}, t[n.name].name = n.name, t[n.name].spec = angular.copy(n);
var a = t[n.name].spec.from;
if (a) {
var r;
if ("ImageStreamImage" === a.kind ? r = "@" : "ImageStreamTag" === a.kind && (r = ":"), r) {
a._nameConnector = r;
var o = a.name.split(r);
1 === o.length ? (a._imageStreamName = e.metadata.name, a._idOrTag = o[0], a._completeName = a._imageStreamName + r + a._idOrTag) : (a._imageStreamName = o.shift(), a._idOrTag = o.join(r), a._completeName = a._imageStreamName + r + a._idOrTag);
}
}
}), angular.forEach(e.status.tags, function(e) {
t[e.tag] = t[e.tag] || {}, t[e.tag].name = e.tag, t[e.tag].status = angular.copy(e);
}), t;
}
};
}), angular.module("openshiftConsole").factory("MembershipService", [ "$filter", "APIService", "Constants", function(e, t, n) {
e("annotation");
var a = function() {
return _.reduce(_.slice(arguments), function(e, t, n) {
return t ? _.isEqual(n, 0) ? t : e + "-" + t : e;
}, "");
}, r = function() {
return {
User: {
kind: "User",
sortOrder: 1,
name: "User",
subjects: {}
},
Group: {
kind: "Group",
sortOrder: 2,
name: "Group",
subjects: {}
},
ServiceAccount: {
kind: "ServiceAccount",
sortOrder: 3,
description: "Service accounts provide a flexible way to control API access without sharing a regular user’s credentials.",
helpLinkKey: "service_accounts",
name: "ServiceAccount",
subjects: {}
}
};
}, o = function(e) {
return _.reduce(e, function(e, n) {
var r = t.parseGroupVersion(n.apiVersion).group;
return e[a(r, n.kind, n.metadata.name)] = n, e;
}, {});
};
return {
sortRoles: function(e) {
return _.sortBy(e, "metadata.name");
},
filterRoles: function(e) {
return _.filter(e, function(e) {
return "Role" === e.kind || _.includes(n.MEMBERSHIP_WHITELIST, e.metadata.name);
});
},
mapRolesForUI: function(e, t) {
return _.merge(o(e), o(t));
},
isLastRole: function(e, t) {
return 1 === _.filter(t, function(t) {
return _.some(t.subjects, {
name: e
});
}).length;
},
getSubjectKinds: r,
mapRolebindingsForUI: function(e, t) {
var n = _.reduce(e, function(e, n) {
var r = a(n.roleRef.apiGroup, n.roleRef.kind, n.roleRef.name);
return _.each(n.subjects, function(n) {
var o = a(n.namespace, n.name);
e[n.kind].subjects[o] || (e[n.kind].subjects[o] = {
name: n.name,
roles: {}
}, n.namespace && (e[n.kind].subjects[o].namespace = n.namespace)), _.includes(e[n.kind].subjects[o].roles, r) || t[r] && (e[n.kind].subjects[o].roles[r] = t[r]);
}), e;
}, {
User: {
kind: "User",
sortOrder: 1,
name: "User",
subjects: {}
},
Group: {
kind: "Group",
sortOrder: 2,
name: "Group",
subjects: {}
},
ServiceAccount: {
kind: "ServiceAccount",
sortOrder: 3,
description: "Service accounts provide a flexible way to control API access without sharing a regular user’s credentials.",
helpLinkKey: "service_accounts",
name: "ServiceAccount",
subjects: {}
}
});
return _.sortBy(n, "sortOrder");
}
};
} ]), angular.module("openshiftConsole").factory("RolesService", [ "$q", "APIService", "DataService", function(e, t, n) {
var a = t.getPreferredVersion("roles"), r = t.getPreferredVersion("clusterroles");
return {
listAllRoles: function(t) {
return e.all([ n.list(a, t, null), n.list(r, {}, null) ]);
}
};
} ]), angular.module("openshiftConsole").factory("RoleBindingsService", [ "$q", "APIService", "DataService", function(e, t, n) {
var a = t.getPreferredVersion("rolebindings"), r = function(e, t) {
return {
kind: "RoleBinding",
apiVersion: "v1",
metadata: {
generateName: _.get(e, "metadata.name") + "-",
namespace: t
},
roleRef: {
name: _.get(e, "metadata.name"),
namespace: _.get(e, "metadata.namespace")
},
subjects: []
};
}, o = function(e, t) {
return _.isEqual(e.kind, "ServiceAccount") && (e.namespace = e.namespace || t), e;
};
return {
create: function(e, a, i, s) {
var c = r(e, i), l = t.objectToResourceGroupVersion(c);
return a = o(a, i), c.subjects.push(angular.copy(a)), n.create(l, null, c, s);
},
addSubject: function(e, a, i, s) {
var c = r(), l = _.extend(c, e), u = t.objectToResourceGroupVersion(l);
if (!a) return l;
if (a = o(a, i), _.isArray(l.subjects)) {
if (_.includes(l.subjects, a)) return;
l.subjects.push(a);
} else l.subjects = [ a ];
return n.update(u, l.metadata.name, l, s);
},
removeSubject: function(t, o, i, s, c) {
var l = _.filter(s, {
roleRef: {
name: o
}
});
return e.all(_.map(l, function(e) {
var o = r();
e = _.extend(o, e);
var s = {
name: t
};
return i && (s.namespace = i), e.subjects = _.reject(e.subjects, s), e.subjects.length ? n.update(a, e.metadata.name, e, c) : n.delete(a, e.metadata.name, c).then(function() {
return e;
});
}));
}
};
} ]), angular.module("openshiftConsole").factory("MetricsService", [ "$filter", "$http", "$q", "$rootScope", "APIDiscovery", function(e, t, n, a, r) {
function o() {
return angular.isDefined(u) ? n.when(u) : r.getMetricsURL().then(function(e) {
return u = (e || "").replace(/\/$/, "");
});
}
function i(e) {
if (e.length) return _.each(e, function(e) {
e.empty || !_.isNumber(e.avg) ? e.value = null : e.value = e.avg;
}), e;
}
function s(e) {
return e.join("|");
}
function c() {
return o().then(function(e) {
return e ? e + "/m/stats/query" : e;
});
}
function l(e) {
return o().then(function(t) {
var n;
return n = "counter" === e.type ? t + g : t + p, URI.expand(n, {
podUID: e.pod.metadata.uid,
containerName: e.containerName,
metric: e.metric
}).toString();
});
}
var u, d, m, p = "/gauges/{containerName}%2F{podUID}%2F{metric}/data", g = "/counters/{containerName}%2F{podUID}%2F{metric}/data", f = function(e) {
var t = e.split("/");
return {
podUID: t[1],
descriptor: t[2] + "/" + t[3]
};
}, h = function(e, n, a) {
var r = _.keyBy(a.pods, "metadata.uid");
return t.post(e, n, {
auth: {},
headers: {
Accept: "application/json",
"Content-Type": "application/json",
"Hawkular-Tenant": a.namespace
}
}).then(function(e) {
var t = {}, n = function(e, n) {
var a = f(n), o = _.get(r, [ a.podUID, "metadata", "name" ]), s = i(e);
_.set(t, [ a.descriptor, o ], s);
};
return _.each(e.data.counter, n), _.each(e.data.gauge, n), t;
});
}, v = _.template("descriptor_name:network/tx_rate|network/rx_rate,type:pod,pod_id:<%= uid %>"), y = _.template("descriptor_name:memory/usage|cpu/usage_rate,type:pod_container,pod_id:<%= uid %>,container_name:<%= containerName %>"), b = _.template("descriptor_name:network/tx_rate|network/rx_rate|memory/usage|cpu/usage_rate,type:pod,pod_id:<%= uid %>");
return {
isAvailable: function(e) {
return o().then(function(n) {
return !!n && (!e || !!d || !m && t.get(n).then(function() {
return d = !0, !0;
}, function(e) {
return m = !0, a.$broadcast("metrics-connection-failed", {
url: n,
response: e
}), !1;
}));
});
},
getMetricsURL: o,
get: function(e) {
return l(e).then(function(n) {
if (!n) return null;
var a = {
bucketDuration: e.bucketDuration,
start: e.start
};
return e.end && (a.end = e.end), t.get(n, {
auth: {},
headers: {
Accept: "application/json",
"Hawkular-Tenant": e.namespace
},
params: a
}).then(function(t) {
return _.assign(t, {
metricID: e.metric,
data: i(t.data)
});
});
});
},
getCurrentUsage: function(e) {
return l(e).then(function(n) {
if (!n) return null;
var a = {
bucketDuration: "1mn",
start: "-1mn"
};
return t.get(n, {
auth: {},
headers: {
Accept: "application/json",
"Hawkular-Tenant": e.namespace
},
params: a
}).then(function(t) {
return _.assign(t, {
metricID: e.metric,
usage: _.head(i(t.data))
});
});
});
},
getPodMetrics: function(e) {
return c().then(function(t) {
var a = {
bucketDuration: e.bucketDuration,
start: e.start
};
e.end && (a.end = e.end);
var r = [], o = [], i = s(_.map(e.pods, "metadata.uid"));
return e.containerName ? (r.push(_.assign({
tags: y({
uid: i,
containerName: e.containerName
})
}, a)), r.push(_.assign({
tags: v({
uid: i
})
}, a))) : r.push(_.assign({
tags: b({
uid: i
})
}, a)), _.each(r, function(n) {
var a = h(t, n, e);
o.push(a);
}), n.all(o).then(function(e) {
var t = {};
return _.each(e, function(e) {
_.assign(t, e);
}), t;
});
});
},
getCustomMetrics: function(e) {
var n = e.metadata.namespace, a = e.metadata.uid;
return o().then(function(e) {
if (!e) return null;
var r = e + "/m", o = {
tags: "custom_metric:true,pod_id:" + a
};
return t.get(r, {
auth: {},
headers: {
Accept: "application/json",
"Hawkular-Tenant": n
},
params: o
}).then(function(e) {
return _.map(e.data, function(e) {
return {
id: e.id,
name: e.tags.metric_name,
unit: e.tags.units,
description: e.tags.description,
type: e.type
};
});
});
});
}
};
} ]), angular.module("openshiftConsole").factory("MetricsCharts", [ "$timeout", "ConversionService", function(e, t) {
var n = function(e, n) {
if (void 0 === e.value || null === e.value) return null;
switch (n) {
case "memory/usage":
return _.round(t.bytesToMiB(e.value), 2);

case "cpu/usage_rate":
return t.millicoresToCores(e.value);

case "network/rx_rate":
case "network/tx_rate":
return _.round(t.bytesToKiB(e.value), 2);

default:
return _.round(e.value);
}
}, a = {
"memory/usage": "Memory",
"cpu/usage_rate": "CPU",
"network/tx_rate": "Sent",
"network/rx_rate": "Received"
};
return {
uniqueID: function() {
return _.uniqueId("metrics-");
},
getDefaultUpdateInterval: function() {
return 6e4;
},
getTimeRangeOptions: function() {
return [ {
label: "Last hour",
value: 60
}, {
label: "Last 4 hours",
value: 240
}, {
label: "Last 12 hours",
value: 720
}, {
label: "Last day",
value: 1440
}, {
label: "Last 3 days",
value: 4320
}, {
label: "Last week",
value: 10080
} ];
},
getDefaultSparklineConfig: function(e, t, n) {
return {
bindto: "#" + e,
axis: {
x: {
show: !n,
type: "timeseries",
padding: {
left: 0,
bottom: 0
},
tick: {
type: "timeseries",
format: "%a %H:%M"
}
},
y: {
show: !n,
label: t,
min: 0,
padding: {
left: 0,
top: 20,
bottom: 0
}
}
},
point: {
show: !1
},
size: {
height: n ? 35 : 175
},
tooltip: {
format: {
value: function(e) {
var n = "cores" === t ? 3 : 2;
return d3.round(e, n) + " " + t;
}
}
}
};
},
getSparklineData: function(e) {
var t, r = {
type: "spline",
x: "dates",
names: a
}, o = {};
return _.each(e, function(e, a) {
t = [ "dates" ], o[a] = [ a ], _.each(e, function(e) {
var r = n(e, a);
t.push(e.start), o[a].push(r);
});
}), r.columns = [ t ].concat(_.values(o)), r;
},
formatUsage: function(e) {
return e < .001 ? "0" : e < 1 ? d3.format(".1r")(e) : d3.format(".2r")(e);
},
redraw: function(t) {
e(function() {
_.each(t, function(e) {
e.flush();
});
}, 0);
}
};
} ]), angular.module("openshiftConsole").factory("StorageService", [ "$filter", "APIService", "DataService", "NotificationsService", function(e, t, n, a) {
var r = e("getErrorDetails"), o = e("humanizeKind");
return {
createVolume: function(e, t) {
return {
name: e,
persistentVolumeClaim: {
claimName: t.metadata.name
}
};
},
createVolumeMount: function(e, t, n, a) {
var r = {
name: e,
mountPath: t,
readOnly: !!a
};
return n && (r.subPath = n), r;
},
getVolumeNames: function(e) {
var t = _.get(e, "spec.volumes", []);
return _.map(t, "name");
},
getMountPaths: function(e, t) {
var n = [], a = _.get(e, "spec.containers", []);
return _.each(a, function(e) {
if (!t || t(e)) {
var a = _.get(e, "volumeMounts", []);
_.each(a, function(e) {
n.push(e.mountPath);
});
}
}), n;
},
removeVolume: function(e, i, s) {
var c = angular.copy(e), l = _.get(c, "spec.template.spec.volumes");
_.remove(l, {
name: i.name
});
var u = _.get(c, "spec.template.spec.containers");
_.each(u, function(e) {
_.remove(e.volumeMounts, {
name: i.name
});
});
var d = t.objectToResourceGroupVersion(c);
return n.update(d, c.metadata.name, c, s).then(function() {
a.addNotification({
type: "success",
message: "Volume " + i.name + " removed from " + o(e.kind) + " " + e.metadata.name + "."
});
}, function(t) {
a.addNotification({
type: "error",
message: "An error occurred removing volume " + i.name + " from " + o(e.kind) + " " + e.metadata.name + ".",
details: r(t)
});
});
}
};
} ]), angular.module("openshiftConsole").factory("LimitRangesService", [ "$filter", "$window", "Constants", function(e, t, n) {
var a = e("annotation"), r = e("usageValue"), o = e("usageWithUnits"), i = function(e, t) {
return !!e && (!t || r(e) < r(t));
}, s = function(e, t) {
return !!e && (!t || r(e) > r(t));
}, c = function(e) {
return _.includes(n.CLUSTER_RESOURCE_OVERRIDES_EXEMPT_PROJECT_NAMES, e);
}, l = function(e) {
return _.some(n.CLUSTER_RESOURCE_OVERRIDES_EXEMPT_PROJECT_PREFIXES, function(t) {
return _.startsWith(e, t);
});
}, u = function(e) {
var t = a(e, "quota.openshift.io/cluster-resource-override-enabled");
return !!t && "true" !== t;
}, d = function(e) {
var t = _.get(e, "metadata.name");
return c(t) || l(t) || u(e);
}, m = function(e) {
return !!_.get(t, "OPENSHIFT_CONFIG.clusterResourceOverridesEnabled") && !d(e);
}, p = function(e, t) {
return m(t);
}, g = function(e, t) {
return "cpu" === e && m(t);
}, f = function(e, t, n) {
var a = {};
return angular.forEach(e, function(e) {
angular.forEach(e.spec.limits, function(e) {
if (e.type === n) {
e.min && s(e.min[t], a.min) && (a.min = e.min[t]), e.max && i(e.max[t], a.max) && (a.max = e.max[t]), e.default && (a.defaultLimit = e.default[t] || a.defaultLimit), e.defaultRequest && (a.defaultRequest = e.defaultRequest[t] || a.defaultRequest);
var r;
e.maxLimitRequestRatio && (r = e.maxLimitRequestRatio[t]) && (!a.maxLimitRequestRatio || r < a.maxLimitRequestRatio) && (a.maxLimitRequestRatio = r);
}
});
}), a;
};
return {
getEffectiveLimitRange: f,
hasClusterResourceOverrides: m,
isRequestCalculated: p,
isLimitCalculated: g,
validatePodLimits: function(t, n, a, i) {
if (!a || !a.length) return [];
var s = f(t, n, "Pod"), c = f(t, n, "Container"), l = 0, u = 0, d = s.min && r(s.min), m = s.max && r(s.max), h = [], v = e("computeResourceLabel")(n, !0);
return angular.forEach(a, function(e) {
var t = e.resources || {}, a = t.requests && t.requests[n] || c.defaultRequest;
a && (l += r(a));
var o = t.limits && t.limits[n] || c.defaultLimit;
o && (u += r(o));
}), p(0, i) || (d && l < d && h.push(v + " request total for all containers is less than pod minimum (" + o(s.min, n) + ")."), m && l > m && h.push(v + " request total for all containers is greater than pod maximum (" + o(s.max, n) + ").")), g(n, i) || (d && u < d && h.push(v + " limit total for all containers is less than pod minimum (" + o(s.min, n) + ")."), m && u > m && h.push(v + " limit total for all containers is greater than pod maximum (" + o(s.max, n) + ").")), h;
}
};
} ]), angular.module("openshiftConsole").factory("RoutesService", [ "$filter", function(e) {
var t = function(e) {
return angular.isString(e);
}, n = function(e, n) {
return _.find(n.spec.ports, function(n) {
return t(e) ? n.name === e : n.targetPort === e;
});
}, a = function(e, a, r, o) {
if ("Service" === a.kind) {
var i = _.get(r, [ a.name ]);
if (i) {
var s = e.spec.port ? e.spec.port.targetPort : null;
s ? n(s, i) || (t(s) ? o.push('Route target port is set to "' + s + '", but service "' + i.metadata.name + '" has no port with that name.') : o.push('Route target port is set to "' + s + '", but service "' + i.metadata.name + '" does not expose that port.')) : _.size(i.spec.ports) > 1 && o.push('Route has no target port, but service "' + i.metadata.name + '" has multiple ports. The route will round robin traffic across all exposed ports on the service.');
} else o.push('Routes to service "' + a.name + '", but service does not exist.');
}
}, r = function(e, t) {
e.spec.tls && (e.spec.tls.termination || t.push("Route has a TLS configuration, but no TLS termination type is specified. TLS will not be enabled until a termination type is set."), "passthrough" === e.spec.tls.termination && e.spec.path && t.push('Route path "' + e.spec.path + '" will be ignored since the route uses passthrough termination.'));
}, o = function(e, t) {
var n = _.get(e, "spec.wildcardPolicy");
angular.forEach(e.status.ingress, function(e) {
var a = _.find(e.conditions, {
type: "Admitted",
status: "False"
});
if (a) {
var r = "Requested host " + (e.host || "<unknown host>") + " was rejected by the router.";
(a.message || a.reason) && (r += " Reason: " + (a.message || a.reason) + "."), t.push(r);
}
a || "Subdomain" !== n || e.wildcardPolicy === n || t.push('Router "' + e.routerName + '" does not support wildcard subdomains. Your route will only be available at host ' + e.host + ".");
});
}, i = function(e) {
return _.some(e.status.ingress, function(e) {
return _.some(e.conditions, {
type: "Admitted",
status: "True"
});
});
}, s = e("annotation"), c = function(e) {
return "true" !== s(e, "openshift.io/host.generated");
}, l = function(e) {
return "true" === s(e, "console.alpha.openshift.io/overview-app-route");
}, u = function(e) {
var t = 0;
l(e) && (t += 21), i(e) && (t += 11);
var n = _.get(e, "spec.alternateBackends");
return _.isEmpty(n) || (t += 5), c(e) && (t += 3), e.spec.tls && (t += 1), t;
}, d = function(e) {
var t = {}, n = function(e, n) {
t[n] = t[n] || [], t[n].push(e);
};
return _.each(e, function(e) {
n(e, e.spec.to.name);
var t = _.get(e, "spec.alternateBackends", []);
_.each(t, function(t) {
"Service" === t.kind && n(e, t.name);
});
}), t;
};
return {
getRouteWarnings: function(e, t) {
var n = [];
return e ? (a(e, e.spec.to, t, n), _.each(e.spec.alternateBackends, function(r) {
a(e, r, t, n);
}), r(e, n), o(e, n), n) : n;
},
getServicePortForRoute: n,
getPreferredDisplayRoute: function(e, t) {
var n = u(e);
return u(t) > n ? t : e;
},
groupByService: function(e, t) {
return t ? d(e) : _.groupBy(e, "spec.to.name");
},
getSubdomain: function(e) {
return _.get(e, "spec.host", "").replace(/^[a-z0-9]([-a-z0-9]*[a-z0-9])\./, "");
},
isCustomHost: c,
isOverviewAppRoute: l,
sortRoutesByScore: function(e) {
return _.orderBy(e, [ u ], [ "desc" ]);
}
};
} ]), angular.module("openshiftConsole").factory("ChartsService", [ "Logger", function(e) {
return {
updateDonutCenterText: function(t, n, a) {
var r = d3.select(t).select("text.c3-chart-arcs-title");
r ? (r.selectAll("*").remove(), r.insert("tspan").text(n).classed(a ? "donut-title-big-pf" : "donut-title-med-pf", !0).attr("dy", a ? 0 : 5).attr("x", 0), a && r.insert("tspan").text(a).classed("donut-title-small-pf", !0).attr("dy", 20).attr("x", 0)) : e.warn("Can't select donut title element");
}
};
} ]), angular.module("openshiftConsole").service("HomePagePreferenceService", [ "$location", "$timeout", "$q", "$uibModal", "AuthService", "Logger", "Navigate", "NotificationsService", function(e, t, n, a, r, o, i, s) {
var c = function() {
localStorage.removeItem("openshift/home-page-pref/");
};
return {
getHomePagePreference: function() {
var e;
try {
e = JSON.parse(localStorage.getItem("openshift/home-page-pref/"));
} catch (e) {
return o.error("Could not parse homePagePref as JSON", e), "catalog-home";
}
return _.get(e, "type", "catalog-home");
},
setHomePagePreference: function(e) {
localStorage.setItem("openshift/home-page-pref/", JSON.stringify(e));
},
getHomePageProjectName: function() {
var e;
try {
e = JSON.parse(localStorage.getItem("openshift/home-page-pref/"));
} catch (e) {
return o.error("Could not parse homePagePref as JSON", e), null;
}
return e && "project-overview" === e.type ? e.project : null;
},
getHomePagePath: function() {
var e = this.getHomePagePreference();
if ("project-overview" === e) {
var t = this.getHomePageProjectName();
return "/" + i.projectOverviewURL(t) + "?isHomePage=true";
}
return "project-list" === e ? "/projects" : "/catalog";
},
notifyInvalidProjectHomePage: function(e) {
c(), s.addNotification({
id: "invalid-home-page-preference",
type: "warning",
message: "Home page project not found.",
details: "Project " + e + " no longer exists or you do not have access to it.",
links: [ {
href: "",
label: "Set Home Page",
onClick: function() {
return a.open({
templateUrl: "views/modals/set-home-page-modal.html",
controller: "SetHomePageModalController"
}), !0;
}
} ]
});
}
};
} ]), angular.module("openshiftConsole").factory("HPAService", [ "$filter", "$q", "LimitRangesService", "MetricsService", function(e, t, n, a) {
var r = e("annotation"), o = function(e, t, n) {
return _.every(n, function(n) {
return _.get(n, [ "resources", t, e ]);
});
}, i = function(e, t) {
return o(e, "requests", t);
}, s = function(e, t) {
return o(e, "limits", t);
}, c = function(e, t, a) {
return !!n.getEffectiveLimitRange(a, e, "Container")[t];
}, l = function(e, t) {
return c(e, "defaultRequest", t);
}, u = function(e, t) {
return c(e, "defaultLimit", t);
}, d = function(e, t, a) {
return !!n.hasClusterResourceOverrides(a) || (!(!i("cpu", e) && !l("cpu", t)) || !(!s("cpu", e) && !u("cpu", t)));
}, m = e("humanizeKind"), p = e("hasDeploymentConfig"), g = function(e) {
if (!e) return {
message: "Metrics might not be configured by your cluster administrator. Metrics are required for autoscaling.",
reason: "MetricsNotAvailable"
};
}, f = function(e, t, n) {
var a, r = _.get(e, "spec.template.spec.containers", []);
if (!d(r, t, n)) return a = m(e.kind), {
message: "This " + a + " does not have any containers with a CPU request set. Autoscaling will not work without a CPU request.",
reason: "NoCPURequest"
};
}, h = function(e) {
return _.some(e, function(e) {
return r(e, "autoscaling.alpha.kubernetes.io/metrics");
});
}, v = function(e) {
if (_.size(e) > 1) return {
message: "More than one autoscaler is scaling this resource. This is not recommended because they might compete with each other. Consider removing all but one autoscaler.",
reason: "MultipleHPA"
};
}, y = function(e, t) {
if ("ReplicationController" === e.kind && p(e) && _.some(t, function() {
return _.some(t, function(e) {
return "ReplicationController" === _.get(e, "spec.scaleTargetRef.kind");
});
})) return {
message: "This deployment is scaled by both a deployment configuration and an autoscaler. This is not recommended because they might compete with each other.",
reason: "DeploymentHasHPA"
};
};
return {
usesV2Metrics: function(e) {
return h([ e ]);
},
hasCPURequest: d,
filterHPA: function(e, t, n) {
return _.filter(e, function(e) {
return e.spec.scaleTargetRef.kind === t && e.spec.scaleTargetRef.name === n;
});
},
getHPAWarnings: function(e, n, r, o) {
return !e || _.isEmpty(n) ? t.when([]) : a.isAvailable().then(function(t) {
var a = h(n);
return _.compact([ g(t), !a && f(e, r, o), v(n), y(e, n) ]);
});
},
groupHPAs: function(e) {
var t = {};
return _.each(e, function(e) {
var n = e.spec.scaleTargetRef.name, a = e.spec.scaleTargetRef.kind;
n && a && (_.has(t, [ a, n ]) || _.set(t, [ a, n ], []), t[a][n].push(e));
}), t;
}
};
} ]), angular.module("openshiftConsole").factory("PodsService", [ "OwnerReferencesService", function(e) {
return {
getImageIDs: function(e, t) {
var n = {}, a = /^.*sha256:/;
return _.each(e, function(e) {
var r, o = _.get(e, "status.containerStatuses", []), i = _.find(o, {
name: t
}), s = _.get(i, "imageID", "");
a.test(s) && (r = s.replace(a, ""), n[r] = !0);
}), _.keys(n);
},
generateDebugPod: function(e, t) {
var n = angular.copy(e), a = _.find(n.spec.containers, {
name: t
});
return a ? (n.metadata = {
name: e.metadata.name + "-debug",
annotations: {
"debug.openshift.io/source-container": t,
"debug.openshift.io/source-resource": "pods/" + e.metadata.name
},
labels: {}
}, n.spec.restartPolicy = "Never", delete n.spec.host, delete n.spec.nodeName, n.status = {}, delete a.readinessProbe, delete a.livenessProbe, a.command = [ "sleep" ], a.args = [ "3600" ], n.spec.containers = [ a ], n) : null;
},
groupByOwnerUID: function(t) {
return e.groupByControllerUID(t);
},
filterForOwner: function(t, n) {
return e.filterForController(t, n);
}
};
} ]), angular.module("openshiftConsole").service("CachedTemplateService", function() {
var e = null;
return {
setTemplate: function(t) {
e = t;
},
getTemplate: function() {
return e;
},
clearTemplate: function() {
e = null;
}
};
}).service("ProcessedTemplateService", function() {
var e = {
params: {
all: [],
generated: []
},
message: null
};
return {
setTemplateData: function(t, n, a) {
_.each(t, function(t) {
e.params.all.push({
name: t.name,
value: t.value
});
}), _.each(n, function(t) {
t.value || e.params.generated.push(t.name);
}), a && (e.message = a);
},
getTemplateData: function() {
return e;
},
clearTemplateData: function() {
e = {
params: {
all: [],
generated: []
},
message: null
};
}
};
}), angular.module("openshiftConsole").factory("SecretsService", [ "$filter", "base64", "Logger", "NotificationsService", function(e, t, n, a) {
var r = e("isNonPrintable"), o = function(t, r) {
a.addNotification({
type: "error",
message: "Base64-encoded " + r + " string could not be decoded.",
details: e("getErrorDetails")(t)
}), n.error("Base64-encoded " + r + " string could not be decoded.", t);
}, i = function(e) {
var n = _.pick(e, [ "email", "username", "password" ]);
if (e.auth) try {
_.spread(function(e, t) {
n.username = e, n.password = t;
})(_.split(t.decode(e.auth), ":", 2));
} catch (e) {
return void o(e, "username:password");
}
return n;
}, s = function(e, n) {
var a, r = {
auths: {}
};
try {
a = JSON.parse(t.decode(e));
} catch (e) {
o(e, n);
}
return a.auths ? (_.each(a.auths, function(e, t) {
e.auth ? r.auths[t] = i(e) : r.auths[t] = e;
}), a.credsStore && (r.credsStore = a.credsStore)) : _.each(a, function(e, t) {
r.auths[t] = i(e);
}), r;
}, c = function(e) {
var n = {}, a = _.mapValues(e, function(e, a) {
if (!e) return "";
var o;
return ".dockercfg" === a || ".dockerconfigjson" === a ? s(e, a) : (o = t.decode(e), r(o) ? (n[a] = !0, e) : o);
});
return a.$$nonprintable = n, a;
};
return {
groupSecretsByType: function(e) {
var t = {
source: [],
image: [],
webhook: [],
other: []
};
return _.each(e.by("metadata.name"), function(e) {
switch (e.type) {
case "kubernetes.io/basic-auth":
case "kubernetes.io/ssh-auth":
case "Opaque":
e.data.WebHookSecretKey ? t.webhook.push(e) : t.source.push(e);
break;

case "kubernetes.io/dockercfg":
case "kubernetes.io/dockerconfigjson":
t.image.push(e);
break;

default:
t.other.push(e);
}
}), t;
},
decodeSecretData: c,
getWebhookSecretValue: function(e, t) {
if (_.get(e, "secretReference.name") && t) {
var n = _.find(t, {
metadata: {
name: e.secretReference.name
}
});
return c(n.data).WebHookSecretKey;
}
return _.get(e, "secret");
}
};
} ]), angular.module("openshiftConsole").factory("ServicesService", [ "$filter", "$q", "APIService", "DataService", function(e, t, n, a) {
var r = n.getPreferredVersion("services"), o = "service.alpha.openshift.io/dependencies", i = e("annotation"), s = function(e) {
var t = i(e, o);
if (!t) return null;
try {
return JSON.parse(t);
} catch (e) {
return Logger.warn('Could not parse "service.alpha.openshift.io/dependencies" annotation', e), null;
}
}, c = function(e, t) {
t.length ? _.set(e, [ "metadata", "annotations", o ], JSON.stringify(t)) : _.has(e, [ "metadata", "annotations", o ]) && delete e.metadata.annotations[o];
};
return {
getDependentServices: function(e) {
var t, n = s(e);
if (!n) return [];
t = _.get(e, "metadata.namespace");
return _.chain(n).filter(function(e) {
return !(!e.name || e.kind && "Service" !== e.kind || e.namespace && e.namespace !== t);
}).map(function(e) {
return e.name;
}).value();
},
linkService: function(e, t) {
var n = angular.copy(e), o = s(n) || [];
return o.push({
name: t.metadata.name,
namespace: e.metadata.namespace === t.metadata.namespace ? "" : t.metadata.namespace,
kind: t.kind
}), c(n, o), a.update(r, n.metadata.name, n, {
namespace: n.metadata.namespace
});
},
removeServiceLink: function(e, n) {
var o = angular.copy(e), i = s(o) || [], l = _.reject(i, function(t) {
return t.kind === n.kind && (t.namespace || e.metadata.namespace) === n.metadata.namespace && t.name === n.metadata.name;
});
return l.length === i.length ? t.when(!0) : (c(o, l), a.update(r, o.metadata.name, o, {
namespace: o.metadata.namespace
}));
},
isInfrastructure: function(e) {
return "true" === i(e, "service.openshift.io/infrastructure");
}
};
} ]), angular.module("openshiftConsole").factory("ImagesService", [ "$filter", "APIService", "ApplicationGenerator", "DataService", function(e, t, n, a) {
var r = t.getPreferredVersion("imagestreamimports"), o = function(e) {
return _.isArray(e) ? e : _.map(e, function(e, t) {
return {
name: t,
value: e
};
});
};
return {
findImage: function(e, n) {
var o = {
kind: "ImageStreamImport",
apiVersion: t.toAPIVersion(r),
metadata: {
name: "newapp",
namespace: n.namespace
},
spec: {
import: !1,
images: [ {
from: {
kind: "DockerImage",
name: e
}
} ]
},
status: {}
};
return a.create(r, null, o, n).then(function(e) {
return {
name: _.get(e, "spec.images[0].from.name"),
image: _.get(e, "status.images[0].image"),
tag: _.get(e, "status.images[0].tag"),
result: _.get(e, "status.images[0].status")
};
});
},
getVolumes: function(e) {
return _.get(e, "dockerImageMetadata.Config.Volumes");
},
runsAsRoot: function(e) {
var t = _.get(e, "dockerImageMetadata.Config.User");
return !t || "0" === t || "root" === t;
},
getResources: function(e) {
var t = [], a = {
"openshift.io/generated-by": "OpenShiftWebConsole"
}, r = o(e.env), i = [], s = [], c = 0;
if (_.forEach(e.volumes, function(t, n) {
c++;
var a = e.name + "-" + c;
i.push({
name: a,
emptyDir: {}
}), s.push({
name: a,
mountPath: n
});
}), !e.namespace) {
var l = {
kind: "ImageStream",
apiVersion: "v1",
metadata: {
name: e.name,
labels: e.labels
},
spec: {
tags: [ {
name: e.tag,
annotations: _.assign({
"openshift.io/imported-from": e.image
}, a),
from: {
kind: "DockerImage",
name: e.image
},
importPolicy: {}
} ]
}
};
t.push(l);
}
var u = _.assign({
deploymentconfig: e.name
}, e.labels), d = {
kind: "DeploymentConfig",
apiVersion: "v1",
metadata: {
name: e.name,
labels: e.labels,
annotations: a
},
spec: {
strategy: {
resources: {}
},
triggers: [ {
type: "ConfigChange"
}, {
type: "ImageChange",
imageChangeParams: {
automatic: !0,
containerNames: [ e.name ],
from: {
kind: "ImageStreamTag",
name: (e.namespace ? e.image : e.name) + ":" + e.tag,
namespace: e.namespace
}
}
} ],
replicas: 1,
test: !1,
selector: u,
template: {
metadata: {
labels: u,
annotations: a
},
spec: {
volumes: i,
containers: [ {
name: e.name,
image: e.image,
ports: e.ports,
env: r,
volumeMounts: s
} ],
resources: {}
}
}
},
status: {}
};
t.push(d);
var m;
return _.isEmpty(e.ports) || (m = {
kind: "Service",
apiVersion: "v1",
metadata: {
name: e.name,
labels: e.labels,
annotations: a
},
spec: {
selector: {
deploymentconfig: e.name
},
ports: _.map(e.ports, function(e) {
return n.getServicePort(e);
})
}
}, t.push(m)), t;
},
getEnvironment: function(e) {
return _.map(_.get(e, "image.dockerImageMetadata.Config.Env"), function(e) {
var t = e.indexOf("="), n = "", a = "";
return t > 0 ? (n = e.substring(0, t), t + 1 < _.size(e) && (a = e.substring(t + 1))) : n = e, {
name: n,
value: a
};
});
}
};
} ]), angular.module("openshiftConsole").factory("ConversionService", function() {
return {
bytesToMiB: function(e) {
return e ? e / 1048576 : e;
},
bytesToKiB: function(e) {
return e ? e / 1024 : e;
},
millicoresToCores: function(e) {
return e ? e / 1e3 : e;
}
};
}), angular.module("openshiftConsole").service("BreadcrumbsService", [ "$filter", "APIService", "Navigate", function(e, t, n) {
var a = e("annotation"), r = e("displayName"), o = function(e) {
switch (e) {
case "DeploymentConfig":
return "Deployments";

default:
return _.startCase(t.kindToResource(e, !0));
}
}, i = function(e, a, i, s) {
var c, l = [], u = s.humanizedKind || o(a);
return s.includeProject && (c = s.project ? r(s.project) : i, l.push({
title: c,
link: n.projectOverviewURL(i)
})), l.push({
title: u,
link: n.resourceListURL(t.kindToResource(a), i)
}), s.parent && l.push(s.parent), s.subpage ? (l.push({
title: s.displayName || e,
link: n.resourceURL(e, a, i)
}), l.push({
title: s.subpage
})) : l.push({
title: s.displayName || e
}), l;
}, s = function(t, r) {
r = r || {};
var o, s = a(t, "deploymentConfig");
return s && (r.humanizedKind = "Deployments", r.parent = {
title: s,
link: n.configURLForResource(t)
}, (o = e("annotation")(t, "deploymentVersion")) && (r.displayName = "#" + o)), i(t.metadata.name, t.kind, t.metadata.namespace, r);
}, c = function(e, t) {
switch (e.kind) {
case "ReplicationController":
return s(e, t);

default:
return i(e.metadata.name, e.kind, e.metadata.namespace, t);
}
};
return {
getBreadcrumbs: function(e) {
return (e = e || {}).object ? c(e.object, e) : e.kind && e.name && e.namespace ? i(e.name, e.kind, e.namespace, e) : [];
}
};
} ]), angular.module("openshiftConsole").factory("QuotaService", [ "$filter", "$location", "$rootScope", "$routeParams", "$q", "APIService", "Constants", "DataService", "EventsService", "Logger", "NotificationsService", function(e, t, n, a, r, o, i, s, c, l, u) {
var d = o.getPreferredVersion("resourcequotas"), m = o.getPreferredVersion("appliedclusterresourcequotas"), p = e("isNil"), g = e("usageValue"), f = e("usageWithUnits"), h = e("percent"), v = function(e) {
return _.every(e.spec.containers, function(e) {
var t = _.some(_.get(e, "resources.requests"), function(e) {
return !p(e) && 0 !== g(e);
}), n = _.some(_.get(e, "resources.limits"), function(e) {
return !p(e) && 0 !== g(e);
});
return !t && !n;
});
}, y = function(e) {
return _.has(e, "spec.activeDeadlineSeconds");
}, b = function(e, t) {
var n = v(e), a = y(e);
return _.filter(t, function(e) {
var t = e.spec.quota ? e.spec.quota.scopes : e.spec.scopes;
return _.every(t, function(e) {
switch (e) {
case "Terminating":
return a;

case "NotTerminating":
return !a;

case "BestEffort":
return n;

case "NotBestEffort":
return !n;
}
return !0;
});
});
}, S = function(e, t) {
return e ? "Pod" === e.kind ? b(e, t) : _.has(e, "spec.template") ? b(e.spec.template, t) : t : t;
}, C = e("humanizeQuotaResource"), w = e("humanizeKind"), P = function(e, t, n) {
var a = e.status.total || e.status;
if (g(a.hard[n]) <= g(a.used[n])) {
var r, o;
return r = "Pod" === t.kind ? "You will not be able to create the " + w(t.kind) + " '" + t.metadata.name + "'." : "You can still create " + w(t.kind) + " '" + t.metadata.name + "' but no pods will be created until resources are freed.", o = "pods" === n ? "You are at your quota for pods." : "You are at your quota for " + C(n) + " on pods.", {
type: "Pod" === t.kind ? "error" : "warning",
message: o,
details: r,
links: [ {
href: "project/" + e.metadata.namespace + "/quota",
label: "View Quota",
target: "_blank"
} ]
};
}
return null;
}, k = {
cpu: "resources.requests.cpu",
"requests.cpu": "resources.requests.cpu",
"limits.cpu": "resources.limits.cpu",
memory: "resources.requests.memory",
"requests.memory": "resources.requests.memory",
"limits.memory": "resources.limits.memory",
persistentvolumeclaims: "resources.limits.persistentvolumeclaims",
"requests.storage": "resources.request.storage"
}, j = function(e, t, n, a) {
var r = e.status.total || e.status, o = k[a], i = 0;
if (_.each(n.spec.containers, function(e) {
var t = _.get(e, o);
t && (i += g(t));
}), g(r.hard[a]) < g(r.used[a]) + i) {
var s;
return s = "Pod" === t.kind ? "You may not be able to create the " + w(t.kind) + " '" + t.metadata.name + "'." : "You can still create " + w(t.kind) + " '" + t.metadata.name + "' but you may not have pods created until resources are freed.", {
type: "warning",
message: "You are close to your quota for " + C(a) + " on pods.",
details: s,
links: [ {
href: "project/" + e.metadata.namespace + "/quota",
label: "View Quota",
target: "_blank"
} ]
};
}
}, R = function(e, t) {
var n = [], a = "Pod" === e.kind ? e : _.get(e, "spec.template");
return a ? (_.each([ "cpu", "memory", "requests.cpu", "requests.memory", "limits.cpu", "limits.memory", "pods" ], function(r) {
var o = t.status.total || t.status;
if (("Pod" !== e.kind || "pods" !== r) && _.has(o, [ "hard", r ]) && _.has(o, [ "used", r ])) {
var i = P(t, e, r);
if (i) n.push(i); else if ("pods" !== r) {
var s = j(t, e, a, r);
s && n.push(s);
}
}
}), n) : n;
}, I = function(e, t, n) {
var a = [];
return e && t ? (_.each(e, function(e) {
var r = S(e, t), i = S(e, n), s = o.objectToResourceGroupVersion(e);
if (s) {
var c = o.kindToResource(e.kind, !0), l = w(e.kind), u = "";
s.group && (u = s.group + "/"), u += s.resource;
var d = function(t) {
var n = t.status.total || t.status;
!p(n.hard[u]) && g(n.hard[u]) <= g(n.used[u]) && a.push({
type: "error",
message: "You are at your quota of " + n.hard[u] + " " + ("1" === n.hard[u] ? l : c) + " in this project.",
details: "You will not be able to create the " + l + " '" + e.metadata.name + "'.",
links: [ {
href: "project/" + t.metadata.namespace + "/quota",
label: "View Quota",
target: "_blank"
} ]
}), a = a.concat(R(e, t));
};
_.each(r, d), _.each(i, d);
}
}), a) : a;
}, T = [ "cpu", "requests.cpu", "memory", "requests.memory", "limits.cpu", "limits.memory" ], N = function(e, t, n, a, r) {
var o, s = "Your project is " + (a < t ? "over" : "at") + " quota. ";
return o = _.includes(T, r) ? s + "It is using " + h(t / a, 0) + " of " + f(n, r) + " " + C(r) + "." : s + "It is using " + t + " of " + a + " " + C(r) + ".", o = _.escape(o), i.QUOTA_NOTIFICATION_MESSAGE && i.QUOTA_NOTIFICATION_MESSAGE[r] && (o += " " + i.QUOTA_NOTIFICATION_MESSAGE[r]), o;
}, A = function(e, t, n) {
var a = function(e) {
var t = e.status.total || e.status;
return _.some(t.hard, function(e, a) {
if ("resourcequotas" === a) return !1;
if (!n || _.includes(n, a)) {
if (!(e = g(e))) return !1;
var r = g(_.get(t, [ "used", a ]));
return !!r && e <= r;
}
});
};
return _.some(e, a) || _.some(t, a);
};
return {
filterQuotasForResource: S,
isBestEffortPod: v,
isTerminatingPod: y,
getResourceLimitAlerts: R,
getQuotaAlerts: I,
getLatestQuotaAlerts: function(e, t) {
var n, a, o = [];
return o.push(s.list(d, t).then(function(e) {
n = e.by("metadata.name"), l.log("quotas", n);
})), o.push(s.list(m, t).then(function(e) {
a = e.by("metadata.name"), l.log("cluster quotas", a);
})), r.all(o).then(function() {
return {
quotaAlerts: I(e, n, a)
};
});
},
isAnyQuotaExceeded: A,
isAnyStorageQuotaExceeded: function(e, t) {
return A(e, t, [ "requests.storage", "persistentvolumeclaims" ]);
},
willRequestExceedQuota: function(e, t, n, a) {
var r = function(e) {
var t = e.status.total || e.status, r = g(a);
if (!n) return !1;
var o = _.get(t.hard, n);
if (!(o = g(o))) return !1;
var i = g(_.get(t, [ "used", n ]));
return i ? o < i + r : o < r;
};
return _.some(e, r) || _.some(t, r);
},
getQuotaNotifications: function(e, r, o) {
var i = [], s = function(e) {
var r = e.status.total || e.status;
_.each(r.hard, function(e, s) {
var c = g(e), l = _.get(r, [ "used", s ]), d = g(l);
"resourcequotas" !== s && c && d && c <= d && i.push({
id: o + "/quota-limit-reached-" + s,
namespace: o,
type: c < d ? "warning" : "info",
message: N(0, d, e, c, s),
isHTML: !0,
skipToast: !0,
showInDrawer: !0,
actions: [ {
name: "View Quotas",
title: "View project quotas",
onClick: function() {
t.url("/project/" + a.project + "/quota"), n.$emit("NotificationDrawerWrapper.hide");
}
}, {
name: "Don't Show Me Again",
title: "Permenantly hide this notificaiton until quota limit changes",
onClick: function(e) {
u.permanentlyHideNotification(e.uid, e.namespace), n.$emit("NotificationDrawerWrapper.clear", e);
}
}, {
name: "Clear",
title: "Clear this notificaiton",
onClick: function(e) {
n.$emit("NotificationDrawerWrapper.clear", e);
}
} ]
});
});
};
return _.each(e, s), _.each(r, s), i;
}
};
} ]), angular.module("openshiftConsole").factory("SecurityCheckService", [ "APIService", "$filter", "Constants", function(e, t, n) {
var a = t("humanizeKind");
return {
getSecurityAlerts: function(t, r) {
var o = [], i = [], s = [], c = [], l = [], u = [];
if (_.each(t, function(t) {
if (_.get(t, "kind")) {
var a = e.objectToResourceGroupVersion(t), r = e.apiInfo(a);
if (r) if (r.namespaced) if ("rolebindings" !== a.resource || "" !== a.group && "rbac.authorization.k8s.io" !== a.group) "roles" !== a.resource || "" !== a.group && "rbac.authorization.k8s.io" !== a.group ? _.find(n.SECURITY_CHECK_WHITELIST, {
resource: a.resource,
group: a.group
}) || u.push(t) : l.push(t); else {
var o = _.get(t, "roleRef.name");
"view" !== o && "system:image-puller" !== o && c.push(t);
} else s.push(t); else i.push(t);
}
}), i.length) {
var d = _.uniq(_.map(i, function(e) {
return "API version " + _.get(e, "apiVersion", "<none>") + " for kind " + a(e.kind);
}));
o.push({
type: "warning",
message: "Some resources will not be created.",
details: "The following resource versions are not supported by the server: " + d.join(", ")
});
}
if (s.length) {
var m = _.uniq(_.map(s, function(e) {
return a(e.kind);
}));
o.push({
type: "warning",
message: "This will create resources outside of the project, which might impact all users of the cluster.",
details: "Typically only cluster administrators can create these resources. The cluster-level resources being created are: " + m.join(", ")
});
}
if (c.length) {
var p = [];
_.each(c, function(e) {
_.each(e.subjects, function(e) {
var t = a(e.kind) + " ";
"ServiceAccount" === e.kind && (t += (e.namespace || r) + "/"), t += e.name, p.push(t);
});
}), p = _.uniq(p), o.push({
type: "warning",
message: "This will grant permissions to your project.",
details: "Permissions are being granted to: " + p.join(", ")
});
}
if (l.length && o.push({
type: "info",
message: "This will create additional membership roles within the project.",
details: "Admins will be able to grant these custom roles to users, groups, and service accounts."
}), u.length) {
var g = _.uniq(_.map(u, function(e) {
return a(e.kind);
}));
o.push({
type: "warning",
message: "This will create resources that may have security or project behavior implications.",
details: "Make sure you understand what they do before creating them. The resources being created are: " + g.join(", ")
});
}
return o;
}
};
} ]), angular.module("openshiftConsole").factory("LabelsService", function() {
var e = function(e) {
return _.get(e, "spec.template", {
metadata: {
labels: {}
}
});
};
return {
groupBySelector: function(t, n, a) {
var r = {}, o = {};
return a = a || {}, _.each(n, function(e) {
o[e.metadata.uid] = new LabelSelector(e.spec.selector);
}), _.each(t, function(t) {
if (!a.include || a.include(t)) {
var i = _.filter(n, function(n) {
var r = o[n.metadata.uid];
return a.matchTemplate ? r.matches(e(t)) : a.matchSelector ? r.covers(new LabelSelector(t.spec.selector)) : r.matches(t);
});
i.length || _.set(r, [ "", t.metadata.name ], t), _.each(i, function(e) {
var n = _.get(e, a.key || "metadata.name", "");
_.set(r, [ n, t.metadata.name ], t);
});
}
}), r;
}
};
}), angular.module("openshiftConsole").factory("CatalogService", [ "$filter", "$q", "$window", "APIService", "AuthService", "Catalog", "Constants", "KeywordService", "Logger", "NotificationsService", function(e, t, n, a, r, o, i, s, c, l) {
var u, d = e("tags"), m = a.getPreferredVersion("servicebindings"), p = a.getPreferredVersion("clusterserviceclasses"), g = a.getPreferredVersion("serviceinstances"), f = a.getPreferredVersion("clusterserviceplans"), h = !i.DISABLE_SERVICE_CATALOG_LANDING_PAGE && a.apiInfo(m) && a.apiInfo(p) && a.apiInfo(g) && a.apiInfo(f), v = function() {
c.debug("ProjectsService: clearing catalog items cache"), u = null;
};
r.onUserChanged(v), r.onLogout(v);
var y = {};
_.each(i.CATALOG_CATEGORIES, function(e) {
_.each(e.items, function(e) {
y[e.id] = e;
var t = _.get(e, "subcategories", []);
_.each(t, function(e) {
_.each(e.items, function(e) {
y[e.id] = e;
});
});
});
});
var b = function(e, t) {
e = e.toLowerCase();
var n;
for (n = 0; n < t.length; n++) if (e === t[n].toLowerCase()) return !0;
return !1;
}, S = function(e, t) {
var n = _.get(e, "categoryAliases", []), a = [ e.id ].concat(n);
return _.some(a, function(e) {
return b(e, t);
});
}, C = function(e) {
return e.from && "ImageStreamTag" === e.from.kind && -1 === e.from.name.indexOf(":") && !e.from.namespace;
}, w = e("displayName"), P = [ "metadata.name", 'metadata.annotations["openshift.io/display-name"]', "metadata.annotations.description" ];
return {
SERVICE_CATALOG_ENABLED: h,
getCatalogItems: function(e) {
return u && !e ? (c.debug("CatalogService: returning cached catalog items"), t.when(u)) : (c.debug("CatalogService: getCatalogItems, force refresh", e), o.getCatalogItems(!0).then(_.spread(function(e, t) {
if (t) {
var n = {
type: "error",
message: t
};
l.addNotification(n);
}
return u = e, e;
})));
},
getCategoryItem: function(e) {
return y[e];
},
categorizeImageStreams: function(e) {
var t = {};
return _.each(e, function(e) {
if (e.status) {
var n = {};
e.spec && e.spec.tags && _.each(e.spec.tags, function(e) {
var t = _.get(e, "annotations.tags");
t && (n[e.name] = t.split(/\s*,\s*/));
});
var a = !1;
_.each(y, function(r) {
(function(e) {
return _.some(e.status.tags, function(e) {
var t = n[e.tag] || [];
return S(r, t) && b("builder", t) && !b("hidden", t);
});
})(e) && (t[r.id] = t[r.id] || [], t[r.id].push(e), a = !0);
}), a || _.some(e.status.tags, function(e) {
var t = n[e.tag] || [];
return b("builder", t) && !b("hidden", t);
}) && (t[""] = t[""] || [], t[""].push(e));
}
}), t;
},
categorizeTemplates: function(e) {
var t = {};
return _.each(e, function(e) {
var n = d(e), a = !1;
_.each(y, function(r) {
S(r, n) && (t[r.id] = t[r.id] || [], t[r.id].push(e), a = !0);
}), a || (t[""] = t[""] || [], t[""].push(e));
}), t;
},
referencesSameImageStream: C,
filterImageStreams: function(e, t) {
if (!t.length) return e;
var n = [];
return _.each(e, function(e) {
var a = _.get(e, "metadata.name", ""), r = w(e, !0), o = [], i = {}, s = {};
_.each(e.spec.tags, function(e) {
if (C(e)) return i[e.name] = e.from.name, s[e.from.name] = s[e.from.name] || [], void s[e.from.name].push(e.name);
o.push(e);
});
var c = _.keyBy(o, "name");
_.each(t, function(e) {
e.test(a) || r && e.test(r) || _.each(o, function(t) {
var n = _.get(t, "annotations.tags", "");
if (/\bbuilder\b/.test(n) && !/\bhidden\b/.test(n)) {
if (!e.test(t.name) && !_.some(s[t.name], function(t) {
return e.test(t);
})) {
var a = _.get(t, "annotations.description");
a && e.test(a) || delete c[t.name];
}
} else delete c[t.name];
});
});
var l;
_.isEmpty(c) || ((l = angular.copy(e)).status.tags = _.filter(l.status.tags, function(e) {
var t = i[e.tag];
return t ? c[t] : c[e.tag];
}), n.push(l));
}), n;
},
filterTemplates: function(e, t) {
return s.filterForKeywords(e, P, t);
}
};
} ]), angular.module("openshiftConsole").factory("ModalsService", [ "$uibModal", function(e) {
return {
confirm: function(t) {
return e.open({
templateUrl: "views/modals/confirm.html",
controller: "ConfirmModalController",
resolve: {
modalConfig: t
}
}).result;
},
confirmSaveLog: function(t) {
return e.open({
templateUrl: "views/modals/confirm-save-log.html",
controller: "ConfirmSaveLogController",
resolve: {
object: t
}
}).result;
},
showJenkinsfileExamples: function() {
e.open({
templateUrl: "views/modals/jenkinsfile-examples-modal.html",
controller: "JenkinsfileExamplesModalController",
size: "lg"
});
},
showComputeUnitsHelp: function() {
e.open({
templateUrl: "views/modals/about-compute-units-modal.html",
controller: "AboutComputeUnitsModalController"
});
}
};
} ]), angular.module("openshiftConsole").factory("CLIHelp", [ "$filter", function(e) {
var t = e("annotation");
return {
getLogsCommand: function(e, n) {
if (!e) return null;
var a, r, o;
switch (e.kind) {
case "Pod":
a = "oc logs " + e.metadata.name, n && (a += " -c " + n);
break;

case "DeploymentConfig":
a = "oc logs dc/" + e.metadata.name;
break;

case "ReplicationController":
r = t(e, "deploymentConfig"), o = t(e, "deploymentVersion"), a = r && o ? "oc logs --version " + o + " dc/" + r : "oc logs rc/" + e.metadata.name;
break;

case "BuildConfig":
a = "oc logs bc/" + e.metadata.name;
break;

case "Build":
r = t(e, "buildConfig"), a = "oc logs --version " + (o = t(e, "buildNumber")) + " bc/" + r;
break;

default:
return null;
}
return a += " -n " + e.metadata.namespace;
}
};
} ]), angular.module("openshiftConsole").factory("EnvironmentService", [ "$filter", "keyValueEditorUtils", function(e, t) {
var n = function(e) {
return "Pod" === e.kind ? _.get(e, "spec.containers", []) : _.get(e, "spec.template.spec.containers", []);
};
return {
getContainers: n,
normalize: function(e) {
var t = n(e);
_.each(t, function(e) {
e.env = e.env || [], e.envFrom = e.envFrom || [];
});
},
compact: function(e) {
var a = n(e);
_.each(a, function(e) {
e.env = t.compactEntries(e.env), e.envFrom = _.reject(e.envFrom, function(e) {
return !_.get(e, "configMapRef.name") && !_.get(e, "secretRef.name");
});
});
},
copyAndNormalize: function(e) {
var t = angular.copy(e);
return this.normalize(t), t;
},
isEnvironmentEqual: function(e, t) {
var a = n(e), r = n(t);
if (a.length !== r.length) return !1;
var o, i, s, c, l;
for (o = 0; o < a.length; o++) {
if (a[o].name !== r[o].name) return !1;
if (i = a[o].env || [], s = r[o].env || [], c = a[o].envFrom || [], l = r[o].envFrom || [], !_.isEqual(i, s) || !_.isEqual(c, l)) return !1;
}
return !0;
},
mergeEdits: function(e, t) {
var a, r = angular.copy(t), o = n(e), i = n(r);
for (a = 0; a < i.length; a++) i[a].env = _.get(o, [ a, "env" ], []), i[a].envFrom = _.get(o, [ a, "envFrom" ], []);
return r;
}
};
} ]), angular.module("openshiftConsole").provider("keyValueEditorConfig", [ function() {
var e = {
keyMinlength: "",
keyMaxlength: "",
valueMinlength: "",
valueMaxlength: "",
keyValidator: "[a-zA-Z0-9-_]+",
valueValidator: "",
keyValidatorError: "Validation error",
keyValidatorErrorTooltip: void 0,
keyValidatorErrorTooltipIcon: "pficon pficon-help",
valueValidatorError: "Validation error",
valueValidatorErrorTooltip: void 0,
valueValidatorErrorTooltipIcon: "pficon pficon-help",
keyPlaceholder: "",
valuePlaceholder: "",
keyRequiredError: "Key is required"
};
this.set = function(t, n) {
angular.isObject(t) ? angular.extend(e, t) : e[t] = n;
}, this.$get = [ function() {
return e;
} ];
} ]), angular.module("openshiftConsole").factory("keyValueEditorUtils", [ "$timeout", "$window", function(e, t) {
var n = function() {
return {
name: "",
value: ""
};
}, a = [ "apiObj", "cannotDelete", "isReadonly", "isReadonlyKey", "isReadonlyValue", "keyValidator", "keyValidatorError", "keyValidatorErrorTooltip", "keyValidatorErrorTooltipIcon", "refType", "selected", "selectedValueFrom", "selectedValueFromKey", "valueValidatorError", "valueIcon", "valueIconTooltip", "valueAlt", "valueValidator", "valueValidatorErrorTooltip", "valueValidatorErrorTooltipIcon" ], r = function(e) {
return _.each(a, function(t) {
e[t] = void 0, delete e[t];
}), e;
}, o = function(e) {
return _.compact(_.map(e, function(e) {
return (e = r(e)).name || e.value || e.valueFrom ? e : void 0;
}));
}, i = function(e, t) {
return {
object: _.find(t, function(t) {
return "ConfigMap" === t.kind && t.metadata.name === e.valueFrom.configMapKeyRef.name;
}),
key: e.valueFrom.configMapKeyRef.key
};
}, s = function(e, t) {
return {
object: _.find(t, function(t) {
return "Secret" === t.kind && t.metadata.name === e.valueFrom.secretKeyRef.name;
}),
key: e.valueFrom.secretKeyRef.key
};
}, c = function(e, t) {
var n = null;
return e.valueFrom.configMapKeyRef ? n = i(e, t) : e.valueFrom.secretKeyRef && (n = s(e, t)), n;
};
return {
newEntry: n,
addEntry: function(e, t) {
e && e.push(t || {
name: "",
value: ""
});
},
addEntryWithSelectors: function(e) {
e && e.push({
name: "",
selectedValueFrom: null,
selectedValueFromKey: null,
valueFrom: {}
});
},
altTextForValueFrom: function(e, t) {
if (!e.value && e.valueFrom) {
e.valueIcon = "pficon pficon-help", e.valueIconTooltip = "This is a referenced value that will be generated when a container is created.  On running pods you can check the resolved values by going to the Terminal tab and echoing the environment variable.";
var n = {
config: "configMapKeyRef",
secret: "secretKeyRef",
field: "fieldRef"
};
e.valueFrom[n.config] ? (e.apiObj = {
kind: "ConfigMap",
metadata: {
name: e.valueFrom[n.config].name,
namespace: t
}
}, e.refType = n.config) : e.valueFrom[n.secret] ? (e.apiObj = {
kind: "Secret",
metadata: {
name: e.valueFrom[n.secret].name,
namespace: t
}
}, e.refType = n.secret, e.valueIcon = "fa fa-user-secret") : e.valueFrom[n.field] ? (e.isReadonlyValue = !0, e.refType = n.field, e.valueAlt = "Set to the field " + e.valueFrom.fieldRef.fieldPath + " in current object") : (e.isReadonlyValue = !0, e.valueAlt = "Set to a reference on a " + _.head(_.keys(e.valueFrom)));
}
},
setEntryPerms: function(e, t, n) {
e.valueFrom && (e.valueFrom.configMapKeyRef && (n || (e.isReadonlyValue = !0)), e.valueFrom.secretKeyRef && (t || (e.isReadonlyValue = !0)));
},
cleanEntry: r,
cleanEntries: function(e) {
return _.map(e, r);
},
compactEntries: o,
mapEntries: function(e) {
return Logger.log("DEPRECATED: mapEntries() drops valueFrom from the entry."), _.reduce(o(e), function(e, t) {
return e[t.name] = t.value, e;
}, {});
},
setFocusOn: function(n, a) {
e(function() {
var e = _.head(t.document.querySelectorAll(n));
e && (e.focus(), a && (e.value = "", e.value = a));
}, 25);
},
uniqueForKey: function(e, t) {
return "key-value-editor-key-" + e + "-" + t;
},
uniqueForValue: function(e, t) {
return "key-value-editor-value-" + e + "-" + t;
},
findReferenceValue: c,
findReferenceValueForEntries: function(e, t) {
_.each(e, function(e) {
var n;
e.valueFrom && (n = c(e, t)) && (_.set(e, "selectedValueFrom", n.object), _.set(e, "selectedValueFromKey", n.key));
});
}
};
} ]), angular.module("openshiftConsole").factory("FullscreenService", [ "IS_SAFARI", function(e) {
var t = document.documentElement.requestFullScreen || document.documentElement.webkitRequestFullScreen || document.documentElement.mozRequestFullScreen || document.documentElement.msRequestFullscreen, n = function(e) {
if (!e || !_.isString(e)) return e;
var t = $(e);
return t.length ? t[0] : null;
};
return {
hasFullscreen: function(n) {
return (!n || !e) && !!t;
},
requestFullscreen: function(e) {
t && (e = n(e)) && t.call(e);
},
exitFullscreen: function() {
document.exitFullscreen ? document.exitFullscreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.webkitExitFullscreen ? document.webkitExitFullscreen() : document.msExitFullscreen && document.msExitFullscreen();
}
};
} ]), angular.module("openshiftConsole").factory("AppsService", function() {
var e = function(e) {
return _.get(e, "metadata.labels.app", "");
}, t = function(e, t) {
return e || t ? e ? t ? e.toLowerCase().localeCompare(t.toLowerCase()) : -1 : 1 : 0;
};
return {
groupByApp: function(t, n) {
var a = _.groupBy(t, e);
return n && _.mapValues(a, function(e) {
return _.sortBy(e, n);
}), a;
},
sortAppNames: function(e) {
e.sort(t);
}
};
}), angular.module("openshiftConsole").factory("ResourceAlertsService", [ "$filter", "AlertMessageService", "DeploymentsService", "Navigate", "NotificationsService", "QuotaService", function(e, t, n, a, r, o) {
var i = e("annotation"), s = e("humanizeKind"), c = e("deploymentStatus"), l = e("groupedPodWarnings"), u = function(e, t, n, a) {
e[t + "-" + n.reason] = {
type: a,
message: n.message
};
};
return {
getPodAlerts: function(e, n) {
if (_.isEmpty(e)) return {};
var r = {}, o = l(e);
return _.each(o, function(e, o) {
var i = _.head(e);
if (i) {
var s = "pod_warning" + o, c = {
type: i.severity || "warning",
message: i.message
};
switch (i.reason) {
case "Looping":
case "NonZeroExit":
var l = a.resourceURL(i.pod, "Pod", n), u = URI(l).addSearch({
tab: "logs",
container: i.container
}).toString();
c.links = [ {
href: u,
label: "View Log"
} ];
break;

case "NonZeroExitTerminatingPod":
if (t.isAlertPermanentlyHidden(s, n)) return;
c.links = [ {
href: "",
label: "Don't Show Me Again",
onClick: function() {
return t.permanentlyHideAlert(s, n), !0;
}
} ];
}
r[s] = c;
}
}), r;
},
getDeploymentStatusAlerts: function(e, t) {
if (!e || !t) return {};
var n, r = {}, o = _.get(e, "metadata.name"), s = c(t), l = i(t, "deploymentVersion"), u = l ? o + " #" + l : t.metadata.name, d = a.resourceURL(t);
switch (s) {
case "Cancelled":
r[t.metadata.uid + "-cancelled"] = {
type: "info",
message: "Deployment " + u + " was cancelled.",
links: [ {
href: d,
label: "View Deployment"
} ]
};
break;

case "Failed":
n = URI(d).addSearch({
tab: "logs"
}).toString(), r[t.metadata.uid + "-failed"] = {
type: "error",
message: "Deployment " + u + " failed.",
reason: i(t, "openshift.io/deployment.status-reason"),
links: [ {
href: n,
label: "View Log"
}, {
href: "project/" + t.metadata.namespace + "/browse/events",
label: "View Events"
} ]
};
}
return r;
},
getPausedDeploymentAlerts: function(t) {
var a = {};
return _.get(t, "spec.paused") && (a[t.metadata.uid + "-paused"] = {
type: "info",
message: t.metadata.name + " is paused.",
details: "This will stop any new rollouts or triggers from running until resumed.",
links: [ {
href: "",
label: "Resume Rollouts",
onClick: function() {
return n.setPaused(t, !1, {
namespace: t.metadata.namespace
}).then(_.noop, function(n) {
a[t.metadata.uid + "-pause-error"] = {
type: "error",
message: "An error occurred resuming the " + s(t.kind) + ".",
details: e("getErrorDetails")(n)
};
}), !0;
}
} ]
}), a;
},
getServiceInstanceAlerts: function(e) {
var t = {};
if (!e) return t;
var n = e.metadata.uid, a = _.find(e.status.conditions, {
reason: "ErrorFindingNamespaceForInstance"
}), r = _.find(e.status.conditions, {
reason: "ProvisionFailed"
}), o = _.find(e.status.conditions, {
reason: "DeprovisioningFailed"
});
return a && u(t, n, a, "warning"), r && u(t, n, r, "error"), o && u(t, n, o, "error"), t;
},
setQuotaNotifications: function(e, t, n) {
var a = o.getQuotaNotifications(e, t, n);
_.each(a, function(e) {
r.isNotificationPermanentlyHidden(e) || r.addNotification(e);
});
}
};
} ]), angular.module("openshiftConsole").factory("ListRowUtils", function() {
var e = function(e) {
var t = _.get(e, "metadata.uid");
return t ? "overview/expand/" + t : null;
}, t = function(t) {
var n = e(t.apiObject);
if (n) {
var a = sessionStorage.getItem(n);
a || !t.state.expandAll ? t.expanded = "true" === a : t.expanded = !0;
} else t.expanded = !1;
};
return {
getNotifications: function(e, t) {
var n = _.get(e, "metadata.uid");
return n ? _.get(t, [ "notificationsByObjectUID", n ]) : null;
},
ui: {
toggleExpand: function(t, n) {
if (n || !($(t.target).closest("a").length > 0 || $(t.target).closest("button").length > 0)) {
var a = e(this.apiObject);
a && (this.expanded = !this.expanded, sessionStorage.setItem(a, this.expanded ? "true" : "false"));
}
},
$onInit: function() {
_.set(this, "selectedTab.networking", !0), t(this);
}
}
};
}), angular.module("openshiftConsole").factory("OwnerReferencesService", function() {
var e = function(e) {
return _.get(e, "metadata.ownerReferences");
};
return {
getOwnerReferences: e,
getControllerReferences: function(t) {
var n = e(t);
return _.filter(n, "controller");
},
groupByControllerUID: function(t) {
var n = {};
return _.each(t, function(t) {
var a = !1;
_.each(e(t), function(e) {
e.controller && (a = !0, n[e.uid] = n[e.uid] || [], n[e.uid].push(t));
}), a || (n[""] = n[""] || [], n[""].push(t));
}), n;
},
filterForController: function(t, n) {
var a = _.get(n, "metadata.uid");
return _.filter(t, function(t) {
return _.some(e(t), {
uid: a,
controller: !0
});
});
}
};
}), angular.module("openshiftConsole").factory("ServiceInstancesService", [ "$filter", "$q", "$uibModal", "APIService", "BindingService", "CatalogService", "DataService", "Logger", "NotificationsService", function(e, t, n, a, r, o, i, s, c) {
var l = a.getPreferredVersion("clusterserviceclasses"), u = a.getPreferredVersion("clusterserviceplans"), d = function(e) {
return _.get(e, "spec.clusterServiceClassRef.name");
}, m = function(e) {
return _.get(e, "spec.clusterServicePlanRef.name");
}, p = function(e, n) {
if (angular.isDefined(n)) return t.when(n);
var o = {
namespace: e.metadata.namespace
}, s = a.getPreferredVersion("servicebindings");
return i.list(s, o).then(function(t) {
return n = t.by("metadata.name"), r.getBindingsForResource(n, e);
});
}, g = function(t) {
var n = {
namespace: t.metadata.namespace
}, r = a.getPreferredVersion("serviceinstances");
c.hideNotification("deprovision-service-error");
var o = {
propagationPolicy: null
};
return i.delete(r, t.metadata.name, n, o).then(function() {
c.addNotification({
type: "success",
message: "Provisioned service '" + t.metadata.name + "' was marked for deletion."
});
}, function(n) {
c.addNotification({
id: "deprovision-service-error",
type: "error",
message: "An error occurred while deleting provisioned service " + t.metadata.name + ".",
details: e("getErrorDetails")(n)
}), s("An error occurred while deleting provisioned service " + t.metadata.name + ".", n);
});
}, f = function(t, n) {
if (o.SERVICE_CATALOG_ENABLED) {
var r = {
namespace: t.metadata.namespace
}, l = a.getPreferredVersion("servicebindings");
p(t, n).then(function(t) {
_.each(t, function(t) {
if (!t.metadata.deletionTimestamp) {
var n = {
propagationPolicy: null
};
i.delete(l, t.metadata.name, r, n).then(function() {
c.addNotification({
type: "success",
message: "Binding " + t.metadata.name + "' was marked for deletion."
});
}).catch(function(n) {
c.addNotification({
type: "error",
message: "Binding " + t.metadata.name + "' could not be deleted.",
details: e("getErrorDetails")(n)
}), s.error("Binding " + t.metadata.name + "' could not be deleted.", n);
});
}
});
});
}
};
return {
getServiceClassNameForInstance: d,
fetchServiceClassForInstance: function(e) {
var t = d(e);
return i.get(l, t, {});
},
getServicePlanNameForInstance: m,
fetchServicePlanForInstance: function(e) {
var t = m(e);
return i.get(u, t, {});
},
isCurrentPlan: function(e, t) {
return m(e) === _.get(t, "metadata.name");
},
deprovision: function(e, t) {
var a, r = {
kind: e.kind,
displayName: e.metadata.name,
okButtonText: "Delete",
okButtonClass: "btn-danger",
cancelButtonText: "Cancel",
delete: function() {
a.close("delete");
}
};
return (a = n.open({
templateUrl: "views/modals/delete-resource.html",
controller: "ConfirmModalController",
resolve: {
modalConfig: function() {
return r;
}
}
})).result.then(function() {
f(e, t), g(e);
});
}
};
} ]), angular.module("openshiftConsole").controller("LandingPageController", [ "$scope", "$rootScope", "AuthService", "CatalogService", "Constants", "DataService", "Navigate", "NotificationsService", "RecentlyViewedServiceItems", "GuidedTourService", "HTMLService", "$timeout", "$q", "$routeParams", "$location", function(e, t, n, a, r, o, i, s, c, l, u, d, m, p, g) {
function f() {
var t = g.search();
return t.serviceExternalName ? _.find(e.catalogItems, {
resource: {
spec: {
externalName: t.serviceExternalName
}
}
}) : null;
}
function h() {
var n = f();
if (n) e.$broadcast("open-overlay-panel", n); else if (y) if (p.startTour) d(function() {
g.replace(), g.search("startTour", null), e.startGuidedTour();
}, 500); else if (_.get(v, "auto_launch")) {
var a = "openshift/viewedHomePage/" + t.user.metadata.name;
"true" !== localStorage.getItem(a) && d(function() {
e.startGuidedTour() && localStorage.setItem(a, "true");
}, 500);
}
}
var v = _.get(r, "GUIDED_TOURS.landing_page_tour"), y = v && v.enabled && v.steps;
e.saasOfferings = r.SAAS_OFFERINGS, e.viewMembership = function(e) {
i.toProjectMembership(e.metadata.name);
}, y && (e.startGuidedTour = function() {
return !u.isWindowBelowBreakpoint(u.WINDOW_SIZE_SM) && (l.startTour(v.steps), !0);
}), s.clearNotifications();
var b = function() {
var t = _.get(e, "template.metadata.uid");
t && c.addItem(t);
}, S = function(e) {
return "PartialObjectMetadata" === e.kind;
}, C = function(e) {
return S(e) ? o.get("templates", e.metadata.name, {
namespace: e.metadata.namespace
}) : m.when(e);
};
e.templateSelected = function(t) {
C(t).then(function(t) {
_.set(e, "ordering.panelName", "template"), e.template = t;
});
}, e.closeOrderingPanel = function() {
e.template && (b(), e.template = null), _.set(e, "ordering.panelName", "");
}, e.deployImageSelected = function() {
_.set(e, "ordering.panelName", "deployImage");
}, e.fromFileSelected = function() {
_.set(e, "ordering.panelName", "fromFile");
}, e.fromProjectSelected = function() {
_.set(e, "ordering.panelName", "fromProject");
}, n.withUser().then(function() {
a.getCatalogItems().then(function(t) {
e.catalogItems = t, h();
});
}), e.$on("$destroy", function() {
b();
}), y && e.$on("$locationChangeStart", function(t) {
g.search().startTour && (e.startGuidedTour(), t.preventDefault());
});
} ]), angular.module("openshiftConsole").controller("ProjectBrowseCatalogController", [ "$scope", "$q", "$routeParams", "DataService", "AuthorizationService", "Catalog", "CatalogService", "Navigate", "NotificationsService", "ProjectsService", function(e, t, n, a, r, o, i, s, c, l) {
var u = n.project;
l.get(u).then(function() {
r.getProjectRules(u).then(function() {
if (r.canIAddToProject(u)) {
var a, l, d = i.getCatalogItems().then(function(e) {
a = e;
}), m = o.getProjectCatalogItems(u).then(_.spread(function(e, t) {
l = e, t && c.addNotification({
type: "error",
message: t
});
}));
t.all([ d, m ]).then(function() {
e.catalogItems = o.sortCatalogItems(_.concat(a, l)), n.filter && (e.keywordFilter = n.filter);
});
} else s.toProjectOverview(u);
});
});
} ]), angular.module("openshiftConsole").factory("EventsService", [ "BrowserStore", function(e) {
var t = e.loadJSON("session", "events") || {}, n = _.get(window, "OPENSHIFT_CONSTANTS.EVENTS_TO_SHOW");
return {
isImportantAPIEvent: function(e) {
return n[e.reason];
},
markRead: function(n) {
_.set(t, [ n, "read" ], !0), e.saveJSON("session", "events", t);
},
isRead: function(e) {
return _.get(t, [ e, "read" ]);
},
markCleared: function(n) {
_.set(t, [ n, "cleared" ], !0), e.saveJSON("session", "events", t);
},
isCleared: function(e) {
return _.get(t, [ e, "cleared" ]);
}
};
} ]), angular.module("openshiftConsole").controller("ProjectsController", [ "$scope", "$filter", "$location", "$route", "$timeout", "AuthService", "DataService", "KeywordService", "Navigate", "Logger", "ProjectsService", function(e, t, n, a, r, o, i, s, c, l, u) {
var d, m, p = [], g = [], f = !1;
e.alerts = e.alerts || {}, e.loading = !0, e.showGetStarted = !1, e.canCreate = void 0, e.search = {
text: ""
}, e.limitListTo = 250;
var h, v = [ "metadata.name", 'metadata.annotations["openshift.io/display-name"]', 'metadata.annotations["openshift.io/description"]', 'metadata.annotations["openshift.io/requester"]' ], y = function() {
e.projects = s.filterForKeywords(m, v, g);
}, b = t("displayName"), S = function() {
var t = _.get(e, "sortConfig.currentField.id");
h !== t && (e.sortConfig.isAscending = "metadata.creationTimestamp" !== t);
var n = function(e) {
return b(e).toLowerCase();
}, a = e.sortConfig.isAscending ? "asc" : "desc";
switch (t) {
case 'metadata.annotations["openshift.io/display-name"]':
m = _.orderBy(d, [ n, "metadata.name" ], [ a ]);
break;

case 'metadata.annotations["openshift.io/requester"]':
m = _.orderBy(d, [ t, n ], [ a, "asc" ]);
break;

default:
m = _.orderBy(d, [ t ], [ a ]);
}
h = t;
}, C = function() {
S(), y();
};
e.sortConfig = {
fields: [ {
id: 'metadata.annotations["openshift.io/display-name"]',
title: "Display Name",
sortType: "alpha"
}, {
id: "metadata.name",
title: "Name",
sortType: "alpha"
}, {
id: 'metadata.annotations["openshift.io/requester"]',
title: "Creator",
sortType: "alpha"
}, {
id: "metadata.creationTimestamp",
title: "Creation Date",
sortType: "alpha"
} ],
isAscending: !0,
onSortChange: C
};
var w = function(t) {
d = _.toArray(t.by("metadata.name")), e.loading = !1, e.showGetStarted = _.isEmpty(d) && !e.isProjectListIncomplete, C();
}, P = function() {
f || u.list().then(w);
};
e.newProjectPanelShown = !1, e.createProject = function(t) {
for (var n = _.get(t, "target"); n && !angular.element(n).hasClass("btn"); ) n = n.parentElement;
e.popupElement = n, e.newProjectPanelShown = !0;
}, e.closeNewProjectPanel = function() {
e.newProjectPanelShown = !1;
}, e.onNewProject = function() {
e.newProjectPanelShown = !1, P();
}, e.editProjectPanelShown = !1, e.editProject = function(t) {
e.editingProject = t, e.editProjectPanelShown = !0;
}, e.closeEditProjectPanel = function() {
e.editProjectPanelShown = !1;
}, e.onEditProject = function() {
e.editProjectPanelShown = !1, P();
}, e.onDeleteProject = P, e.goToProject = function(e) {
c.toProjectOverview(e);
}, e.$watch("search.text", _.debounce(function(t) {
e.keywords = g = s.generateKeywords(t), e.$applyAsync(y);
}, 350)), o.withUser().then(function() {
u.list().then(function(t) {
e.isProjectListIncomplete = u.isProjectListIncomplete(), w(t), !e.isProjectListIncomplete && _.size(d) <= 250 && (p.push(u.watch(e, w)), f = !0);
}, function() {
e.isProjectListIncomplete = !0, e.loading = !1, d = [], C();
});
}), u.canCreate().then(function() {
e.canCreate = !0;
}, function(t) {
e.canCreate = !1;
var n = t.data || {};
if (403 !== t.status) {
var a = "Failed to determine create project permission";
return 0 !== t.status && (a += " (" + t.status + ")"), void l.warn(a);
}
if (n.details) {
var r = [];
_.forEach(n.details.causes || [], function(e) {
e.message && r.push(e.message);
}), _.isEmpty(r) || (e.newProjectMessage = r.join("\n"));
}
}), e.$on("$destroy", function() {
i.unwatchAll(p);
});
} ]), angular.module("openshiftConsole").controller("PodsController", [ "$filter", "$routeParams", "$scope", "APIService", "DataService", "ProjectsService", "LabelFilter", "Logger", function(e, t, n, a, r, o, i, s) {
n.projectName = t.project, n.pods = {}, n.unfilteredPods = {}, n.labelSuggestions = {}, n.clearFilter = function() {
i.clear();
};
var c = a.getPreferredVersion("pods"), l = [];
o.get(t.project).then(_.spread(function(e, t) {
function a() {
n.filterWithZeroResults = !i.getLabelSelector().isEmpty() && _.isEmpty(n.pods) && !_.isEmpty(n.unfilteredPods);
}
n.project = e, l.push(r.watch(c, t, function(e) {
n.podsLoaded = !0, n.unfilteredPods = e.by("metadata.name"), n.pods = i.getLabelSelector().select(n.unfilteredPods), i.addLabelSuggestionsFromResources(n.unfilteredPods, n.labelSuggestions), i.setLabelSuggestions(n.labelSuggestions), a(), s.log("pods (subscribe)", n.unfilteredPods);
})), i.onActiveFiltersChanged(function(e) {
n.$evalAsync(function() {
n.pods = e.select(n.unfilteredPods), a();
});
}), n.$on("$destroy", function() {
r.unwatchAll(l);
});
}));
} ]), angular.module("openshiftConsole").controller("PodController", [ "$filter", "$rootScope", "$routeParams", "$scope", "$timeout", "$uibModal", "APIService", "DataService", "FullscreenService", "ImageStreamResolver", "Logger", "MetricsService", "OwnerReferencesService", "PodsService", "ProjectsService", function(e, t, n, a, r, o, i, s, c, l, u, d, m, p, g) {
a.projectName = n.project, a.pod = null, a.imageStreams = {}, a.imagesByDockerReference = {}, a.imageStreamImageRefByDockerReference = {}, a.builds = {}, a.alerts = {}, a.terminalDisconnectAlert = {}, a.renderOptions = a.renderOptions || {}, a.renderOptions.hideFilterWidget = !0, a.logOptions = {}, a.terminalTabWasSelected = !1, a.breadcrumbs = [ {
title: "Pods",
link: "project/" + n.project + "/browse/pods"
}, {
title: n.pod
} ], a.terminalDisconnectAlert.disconnect = {
type: "warning",
message: "This terminal has been disconnected. If you reconnect, your terminal history will be lost."
}, a.noContainersYet = !0, a.selectedTab = {};
var f = i.getPreferredVersion("imagestreams"), h = i.getPreferredVersion("builds");
a.podsVersion = i.getPreferredVersion("pods"), a.podsLogVersion = i.getPreferredVersion("pods/log"), a.eventsVersion = i.getPreferredVersion("events"), a.deploymentConfigsVersion = i.getPreferredVersion("deploymentconfigs");
var v = [], y = null, b = null;
d.isAvailable().then(function(e) {
a.metricsAvailable = e;
});
var S = function() {
if (a.pod) {
var e = _.find(a.pod.status.containerStatuses, {
name: a.logOptions.container
}), t = _.get(e, "state"), n = _.head(_.keys(t)), r = _.includes([ "running", "waiting", "terminated" ], n) ? n : "", o = _.get(e, "lastState"), i = _.head(_.keys(o)), s = _.get(e, "state.waiting");
angular.extend(a, {
containerStatusKey: r,
containerStateReason: _.get(t, [ n, "reason" ])
}), s ? angular.extend(a, {
lasStatusKey: i,
containerStartTime: _.get(o, [ i, "startedAt" ]),
containerEndTime: _.get(o, [ i, "finishedAt" ])
}) : angular.extend(a, {
containerStartTime: _.get(t, [ n, "startedAt" ]),
containerEndTime: _.get(t, [ n, "finishedAt" ])
});
}
}, C = function() {
var e = $("<span>").css({
position: "absolute",
top: "-100px"
}).addClass("terminal-font").text(_.repeat("x", 10)).appendTo("body"), t = {
width: e.width() / 10,
height: e.height()
};
return e.remove(), t;
}(), w = $(window), P = function(e) {
e || (e = 0), C.height && C.width && a.selectedTab.terminal && !(e > 10) && a.$evalAsync(function() {
var t = $(".container-terminal-wrapper").get(0);
if (t) {
var n = t.getBoundingClientRect();
if (0 !== n.left || 0 !== n.top || 0 !== n.width || 0 !== n.height) {
var o = w.height(), i = n.width - 17, s = o - n.top - 36;
a.terminalCols = Math.max(_.floor(i / C.width), 80), a.terminalRows = Math.max(_.floor(s / C.height), 24);
} else r(function() {
P(e + 1);
}, 50);
} else r(function() {
P(e + 1);
}, 50);
});
}, k = function() {
$(window).on("resize.terminalsize", _.debounce(P, 100)), y || (y = t.$on("oscHeader.toggleNav", function() {
setTimeout(P, 150);
}));
}, j = function() {
$(window).off("resize.terminalsize"), y && (y(), y = null);
};
a.$watch("selectedTab.terminal", function(e) {
e ? (C.height && C.width ? k() : u.warn("Unable to calculate the bounding box for a character.  Terminal will not be able to resize."), r(P, 0)) : j();
}), a.onTerminalSelectChange = function(e) {
_.each(a.containerTerminals, function(e) {
e.isVisible = !1;
}), e.isVisible = !0, e.isUsed = !0, a.selectedTerminalContainer = e;
};
var R = function(e) {
var t = _.get(e, "state", {});
return _.head(_.keys(t));
}, I = function() {
var e = [];
_.each(a.pod.spec.containers, function(t) {
var n = _.find(a.pod.status.containerStatuses, {
name: t.name
}), r = R(n);
e.push({
containerName: t.name,
isVisible: !1,
isUsed: !1,
containerState: r
});
});
var t = _.head(e);
return t.isVisible = !0, t.isUsed = !0, a.selectedTerminalContainer = t, e;
}, T = function(e) {
a.noContainersYet && (a.noContainersYet = 0 === a.containersRunning(e.status.containerStatuses));
}, N = function(e) {
_.each(e, function(e) {
var t = _.find(a.pod.status.containerStatuses, {
name: e.containerName
}), n = R(t);
e.containerState = n;
});
}, A = e("annotation"), E = function(e, t) {
if (a.loaded = !0, a.pod = e, a.dcName = A(e, "deploymentConfig"), a.rcName = A(e, "deployment"), a.deploymentVersion = A(e, "deploymentVersion"), a.logCanRun = !_.includes([ "New", "Pending", "Unknown" ], e.status.phase), S(), delete a.controllerRef, !a.dcName) {
var n = m.getControllerReferences(e);
a.controllerRef = _.find(n, function(e) {
return "ReplicationController" === e.kind || "ReplicaSet" === e.kind || "Build" === e.kind || "StatefulSet" === e.kind;
});
}
"DELETED" === t && (a.alerts.deleted = {
type: "warning",
message: "This pod has been deleted."
});
};
g.get(n.project).then(_.spread(function(t, r) {
b = r, a.project = t, a.projectContext = r, s.get(a.podsVersion, n.pod, r, {
errorNotification: !1
}).then(function(e) {
E(e);
var t = {};
t[e.metadata.name] = e, a.logOptions.container = n.container || e.spec.containers[0].name, a.containerTerminals = I(), T(e), l.fetchReferencedImageStreamImages(t, a.imagesByDockerReference, a.imageStreamImageRefByDockerReference, b), v.push(s.watchObject(a.podsVersion, n.pod, r, function(e, t) {
E(e, t), N(a.containerTerminals), T(e);
}));
}, function(t) {
a.loaded = !0, a.alerts.load = {
type: "error",
message: "The pod details could not be loaded.",
details: e("getErrorDetails")(t)
};
}), a.$watch("logOptions.container", S), v.push(s.watch(f, r, function(e) {
a.imageStreams = e.by("metadata.name"), l.buildDockerRefMapForImageStreams(a.imageStreams, a.imageStreamImageRefByDockerReference), l.fetchReferencedImageStreamImages(a.pods, a.imagesByDockerReference, a.imageStreamImageRefByDockerReference, r), u.log("imagestreams (subscribe)", a.imageStreams);
})), v.push(s.watch(h, r, function(e) {
a.builds = e.by("metadata.name"), u.log("builds (subscribe)", a.builds);
}));
var d, m = function() {
var t = a.debugPod;
d && (s.unwatch(d), d = null), $(window).off("beforeunload.debugPod"), t && (s.delete(a.podsVersion, t.metadata.name, r, {
gracePeriodSeconds: 0
}).then(_.noop, function(n) {
a.alerts["debug-container-error"] = {
type: "error",
message: "Could not delete pod " + t.metadata.name,
details: e("getErrorDetails")(n)
};
}), a.debugPod = null);
}, g = function() {
$(".terminal:visible").focus();
};
a.hasFullscreen = c.hasFullscreen(!0), a.fullscreenTerminal = function() {
c.requestFullscreen("#container-terminal-wrapper"), setTimeout(g);
}, a.exitFullscreen = function() {
c.exitFullscreen();
}, a.debugTerminal = function(t) {
var n = p.generateDebugPod(a.pod, t);
n ? s.create(i.objectToResourceGroupVersion(n), null, n, r).then(function(e) {
var i = _.find(a.pod.spec.containers, {
name: t
});
a.debugPod = e, $(window).on("beforeunload.debugPod", function() {
return "Are you sure you want to leave with the debug terminal open? The debug pod will not be deleted unless you close the dialog.";
}), d = s.watchObject(a.podsVersion, n.metadata.name, r, function(e) {
a.debugPod = e;
}), o.open({
templateUrl: "views/modals/debug-terminal.html",
controller: "DebugTerminalModalController",
scope: a,
resolve: {
container: function() {
return i;
},
image: function() {
return _.get(a, [ "imagesByDockerReference", i.image ]);
}
}
}).result.then(m);
}, function(n) {
a.alerts["debug-container-error"] = {
type: "error",
message: "Could not debug container " + t,
details: e("getErrorDetails")(n)
};
}) : a.alerts["debug-container-error"] = {
type: "error",
message: "Could not debug container " + t
};
}, a.containersRunning = function(e) {
var t = 0;
return e && e.forEach(function(e) {
e.state && e.state.running && t++;
}), t;
}, a.$on("$destroy", function() {
s.unwatchAll(v), m(), j();
});
}));
} ]), angular.module("openshiftConsole").controller("OverviewController", [ "$scope", "$filter", "$q", "$location", "$routeParams", "AlertMessageService", "APIService", "AppsService", "BindingService", "BuildsService", "CatalogService", "Constants", "DataService", "DeploymentsService", "HomePagePreferenceService", "HPAService", "HTMLService", "ImageStreamResolver", "KeywordService", "LabelFilter", "Logger", "MetricsService", "Navigate", "OwnerReferencesService", "PodsService", "ProjectsService", "PromiseUtils", "ResourceAlertsService", "RoutesService", "ServiceInstancesService", "KubevirtVersions", OverviewController ]), angular.module("openshiftConsole").controller("QuotaController", [ "$filter", "$routeParams", "$scope", "APIService", "DataService", "Logger", "ProjectsService", function(e, t, n, a, r, o, i) {
n.projectName = t.project, n.limitRanges = {}, n.limitsByType = {}, n.labelSuggestions = {}, n.alerts = n.alerts || {}, n.quotaHelp = "Limits resource usage within this project.", n.emptyMessageLimitRanges = "Loading...", n.limitRangeHelp = "Defines minimum and maximum constraints for runtime resources such as memory and CPU.", n.renderOptions = n.renderOptions || {}, n.renderOptions.hideFilterWidget = !0;
var s = a.getPreferredVersion("appliedclusterresourcequotas"), c = a.getPreferredVersion("resourcequotas"), l = a.getPreferredVersion("limitranges"), u = [], d = e("usageValue");
n.isAtLimit = function(e, t) {
var n = e.status.total || e.status, a = d(_.get(n, [ "hard", t ]));
if (!a) return !1;
var r = d(_.get(n, [ "used", t ]));
return !!r && r >= a;
};
var m = e("humanizeQuotaResource"), p = function(e, t) {
return "cpu" === e || "requests.cpu" === e ? "cpu" === t || "requests.cpu" === t ? 0 : -1 : "cpu" === t || "requests.cpu" === t ? 1 : "memory" === e || "requests.memory" === e ? "memory" === t || "requests.memory" === t ? 0 : -1 : "memory" === t || "requests.memory" === t ? 1 : "limits.cpu" === e ? "limits.cpu" === t ? 0 : -1 : "limits.cpu" === t ? 1 : "limits.memory" === e ? "limits.memory" === t ? 0 : -1 : "limits.memory" === t ? 1 : (e = m(e), t = m(t), e.localeCompare(t));
}, g = function(e) {
var t = {};
return _.each(e, function(e) {
var n = _.get(e, "spec.quota.hard") || _.get(e, "spec.hard"), a = _.keys(n).sort(p);
t[e.metadata.name] = a;
}), t;
};
i.get(t.project).then(_.spread(function(e, a) {
n.project = e, u.push(r.watch(c, a, function(e) {
n.quotas = _.sortBy(e.by("metadata.name"), "metadata.name"), n.orderedTypesByQuota = g(n.quotas), o.log("quotas", n.quotas);
}, {
poll: !0,
pollInterval: 6e4
})), u.push(r.watch(s, a, function(e) {
n.clusterQuotas = _.sortBy(e.by("metadata.name"), "metadata.name"), n.orderedTypesByClusterQuota = g(n.clusterQuotas), n.namespaceUsageByClusterQuota = {}, _.each(n.clusterQuotas, function(e) {
if (e.status) {
var a = _.find(e.status.namespaces, {
namespace: t.project
});
n.namespaceUsageByClusterQuota[e.metadata.name] = a.status;
}
}), o.log("cluster quotas", n.clusterQuotas);
}, {
poll: !0,
pollInterval: 6e4
})), u.push(r.watch(l, a, function(e) {
n.limitRanges = _.sortBy(e.by("metadata.name"), "metadata.name"), n.emptyMessageLimitRanges = "There are no limit ranges set on this project.", angular.forEach(n.limitRanges, function(e) {
var t = e.metadata.name;
n.limitsByType[t] = {}, angular.forEach(e.spec.limits, function(e) {
var a = n.limitsByType[t][e.type] = {};
angular.forEach(e.max, function(e, t) {
a[t] = a[t] || {}, a[t].max = e;
}), angular.forEach(e.min, function(e, t) {
a[t] = a[t] || {}, a[t].min = e;
}), angular.forEach(e.default, function(e, t) {
a[t] = a[t] || {}, a[t].default = e;
}), angular.forEach(e.defaultRequest, function(e, t) {
a[t] = a[t] || {}, a[t].defaultRequest = e;
}), angular.forEach(e.maxLimitRequestRatio, function(e, t) {
a[t] = a[t] || {}, a[t].maxLimitRequestRatio = e;
});
});
}), o.log("limitRanges", n.limitRanges);
}, {
poll: !0,
pollInterval: 6e4
})), n.$on("$destroy", function() {
r.unwatchAll(u);
});
}));
} ]), angular.module("openshiftConsole").controller("MonitoringController", [ "$routeParams", "$location", "$scope", "$filter", "APIService", "BuildsService", "DataService", "ImageStreamResolver", "KeywordService", "Logger", "MetricsService", "Navigate", "PodsService", "ProjectsService", "$rootScope", function(e, t, n, a, r, o, i, s, c, l, u, d, m, p, g) {
n.projectName = e.project, n.alerts = n.alerts || {}, n.renderOptions = n.renderOptions || {}, n.renderOptions.showEventsSidebar = !0, n.renderOptions.collapseEventsSidebar = "true" === localStorage.getItem("monitoring.eventsidebar.collapsed"), n.buildsLogVersion = r.getPreferredVersion("builds/log"), n.podsLogVersion = r.getPreferredVersion("pods/log"), n.deploymentConfigsLogVersion = r.getPreferredVersion("deploymentconfigs/log");
var f = a("isIE")(), h = [];
n.kinds = [ {
kind: "All"
}, {
kind: "Pods"
}, {
label: "Deployments",
kind: "ReplicationControllers"
}, {
kind: "Builds"
}, {
kind: "StatefulSets"
} ], n.kindSelector = {
selected: _.find(n.kinds, {
kind: e.kind
}) || _.head(n.kinds)
}, n.logOptions = {
pods: {},
replicationControllers: {},
builds: {},
statefulSets: {}
}, n.logCanRun = {
pods: {},
replicationControllers: {},
builds: {},
statefulSets: {}
}, n.logEmpty = {
pods: {},
replicationControllers: {},
builds: {},
statefulSets: {}
}, n.expanded = {
pods: {},
replicationControllers: {},
replicaSets: {},
builds: {},
statefulSets: {}
};
var v = a("isNil");
n.filters = {
hideOlderResources: v(e.hideOlderResources) || "true" === e.hideOlderResources,
text: ""
};
var y, b, S, C;
u.isAvailable().then(function(e) {
n.metricsAvailable = e;
});
var w = a("orderObjectsByDate"), P = [ "metadata.name" ], k = [], j = function() {
n.filteredPods = c.filterForKeywords(C, P, k), n.filteredReplicationControllers = c.filterForKeywords(b, P, k), n.filteredReplicaSets = c.filterForKeywords(S, P, k), n.filteredBuilds = c.filterForKeywords(y, P, k), n.filteredStatefulSets = c.filterForKeywords(_.values(n.statefulSets), P, k);
}, R = function(e) {
n.logOptions.pods[e.metadata.name] = {
container: e.spec.containers[0].name
}, n.logCanRun.pods[e.metadata.name] = !_.includes([ "New", "Pending", "Unknown" ], e.status.phase);
}, I = function(e) {
n.logOptions.replicationControllers[e.metadata.name] = {};
var t = a("annotation")(e, "deploymentVersion");
t && (n.logOptions.replicationControllers[e.metadata.name].version = t), n.logCanRun.replicationControllers[e.metadata.name] = !_.includes([ "New", "Pending" ], a("deploymentStatus")(e));
}, T = function(e) {
n.logOptions.builds[e.metadata.name] = {}, n.logCanRun.builds[e.metadata.name] = !_.includes([ "New", "Pending", "Error" ], e.status.phase);
}, N = function() {
n.filteredStatefulSets = c.filterForKeywords(_.values(n.statefulSets), P, k);
}, A = function() {
C = _.filter(n.pods, function(e) {
return !n.filters.hideOlderResources || "Succeeded" !== e.status.phase && "Failed" !== e.status.phase;
}), n.filteredPods = c.filterForKeywords(C, P, k);
}, E = a("isIncompleteBuild"), D = a("buildConfigForBuild"), B = a("isRecentBuild"), L = function() {
moment().subtract(5, "m");
y = _.filter(n.builds, function(e) {
if (!n.filters.hideOlderResources) return !0;
if (E(e)) return !0;
var t = D(e);
return t ? n.latestBuildByConfig[t].metadata.name === e.metadata.name : B(e);
}), n.filteredBuilds = c.filterForKeywords(y, P, k);
}, V = a("deploymentStatus"), U = a("deploymentIsInProgress"), O = function() {
b = _.filter(n.replicationControllers, function(e) {
return !n.filters.hideOlderResources || (U(e) || "Active" === V(e));
}), n.filteredReplicationControllers = c.filterForKeywords(b, P, k);
}, F = function() {
S = _.filter(n.replicaSets, function(e) {
return !n.filters.hideOlderResources || _.get(e, "status.replicas");
}), n.filteredReplicaSets = c.filterForKeywords(S, P, k);
};
n.toggleItem = function(e, t, r, o) {
var i = $(e.target);
if (o || !i || !i.closest("a", t).length) {
var s, c;
switch (r.kind) {
case "Build":
s = !n.expanded.builds[r.metadata.name], n.expanded.builds[r.metadata.name] = s, c = s ? "event.resource.highlight" : "event.resource.clear-highlight", g.$emit(c, r);
var l = _.get(n.podsByName, a("annotation")(r, "buildPod"));
l && g.$emit(c, l);
break;

case "ReplicationController":
s = !n.expanded.replicationControllers[r.metadata.name], n.expanded.replicationControllers[r.metadata.name] = s, c = s ? "event.resource.highlight" : "event.resource.clear-highlight", g.$emit(c, r);
var u = a("annotation")(r, "deployerPod");
u && g.$emit(c, {
kind: "Pod",
metadata: {
name: u
}
}), _.each(n.podsByOwnerUID[r.metadata.uid], function(e) {
g.$emit(c, e);
});
break;

case "ReplicaSet":
s = !n.expanded.replicaSets[r.metadata.name], n.expanded.replicaSets[r.metadata.name] = s, c = s ? "event.resource.highlight" : "event.resource.clear-highlight", g.$emit(c, r), _.each(n.podsByOwnerUID[r.metadata.uid], function(e) {
g.$emit(c, e);
});
break;

case "Pod":
s = !n.expanded.pods[r.metadata.name], n.expanded.pods[r.metadata.name] = s, c = s ? "event.resource.highlight" : "event.resource.clear-highlight", g.$emit(c, r);
break;

case "StatefulSet":
s = !n.expanded.statefulSets[r.metadata.name], n.expanded.statefulSets[r.metadata.name] = s, c = s ? "event.resource.highlight" : "event.resource.clear-highlight", g.$emit(c, r);
}
}
}, p.get(e.project).then(_.spread(function(e, a) {
n.project = e, n.projectContext = a, h.push(i.watch("pods", a, function(e) {
n.podsByName = e.by("metadata.name"), n.pods = w(n.podsByName, !0), n.podsByOwnerUID = m.groupByOwnerUID(n.pods), n.podsLoaded = !0, _.each(n.pods, R), A(), l.log("pods", n.pods);
})), h.push(i.watch({
resource: "statefulsets",
group: "apps",
version: "v1beta1"
}, a, function(e) {
n.statefulSets = e.by("metadata.name"), n.statefulSetsLoaded = !0, N(), l.log("statefulSets", n.statefulSets);
}, {
poll: f,
pollInterval: 6e4
})), h.push(i.watch("replicationcontrollers", a, function(e) {
n.replicationControllers = w(e.by("metadata.name"), !0), n.replicationControllersLoaded = !0, _.each(n.replicationControllers, I), O(), l.log("replicationcontrollers", n.replicationControllers);
})), h.push(i.watch("builds", a, function(e) {
n.builds = w(e.by("metadata.name"), !0), n.latestBuildByConfig = o.latestBuildByConfig(n.builds), n.buildsLoaded = !0, _.each(n.builds, T), L(), l.log("builds", n.builds);
})), h.push(i.watch({
group: "extensions",
resource: "replicasets"
}, a, function(e) {
n.replicaSets = w(e.by("metadata.name"), !0), n.replicaSetsLoaded = !0, F(), l.log("replicasets", n.replicaSets);
}, {
poll: f,
pollInterval: 6e4
})), n.$on("$destroy", function() {
i.unwatchAll(h);
}), n.$watch("filters.hideOlderResources", function() {
A(), L(), O(), F(), N();
var e = t.search();
e.hideOlderResources = n.filters.hideOlderResources ? "true" : "false", t.replace().search(e);
}), n.$watch("kindSelector.selected.kind", function() {
var e = t.search();
e.kind = n.kindSelector.selected.kind, t.replace().search(e);
}), n.$watch("filters.text", _.debounce(function() {
n.filterKeywords = k = c.generateKeywords(n.filters.text), n.$apply(j);
}, 50, {
maxWait: 250
})), n.$watch("renderOptions.collapseEventsSidebar", function(e, t) {
e !== t && (localStorage.setItem("monitoring.eventsidebar.collapsed", n.renderOptions.collapseEventsSidebar ? "true" : "false"), g.$emit("metrics.charts.resize"));
});
}));
} ]), angular.module("openshiftConsole").controller("MembershipController", [ "$filter", "$location", "$routeParams", "$scope", "$timeout", "$uibModal", "APIService", "AuthService", "AuthorizationService", "DataService", "ProjectsService", "MembershipService", "NotificationsService", "RoleBindingsService", "RolesService", function(e, t, n, a, r, o, i, s, c, l, u, d, m, p, g) {
var f, h = n.project, v = e("humanizeKind"), y = e("annotation"), b = e("canI"), S = i.getPreferredVersion("serviceaccounts");
a.roleBindingsVersion = i.getPreferredVersion("rolebindings");
var C = [], w = {
notice: {
yourLastRole: _.template('Removing the role "<%= roleName %>" may completely remove your ability to see this project.')
},
warning: {
serviceAccount: _.template("Removing a system role granted to a service account may cause unexpected behavior.")
},
remove: {
areYouSure: {
html: {
subject: _.template("Are you sure you want to remove <strong><%- roleName %></strong> from the <%- kindName %> <strong><%- subjectName %></strong>?"),
self: _.template("Are you sure you want to remove <strong><%- roleName %></strong> from <strong><%- subjectName %></strong> (you)?")
}
},
success: _.template('The role "<%= roleName %>" was removed from "<%= subjectName %>".'),
error: _.template('The role "<%= roleName %>" was not removed from "<%= subjectName %>".')
},
update: {
subject: {
success: _.template('The role "<%= roleName %>" was granted to "<%= subjectName %>".'),
error: _.template('The role "<%= roleName %>" could not be granted to "<%= subjectName %>".'),
exists: _.template('The role "<%= roleName %>" has already been granted to "<%= subjectName %>".')
}
}
}, P = function(e, t, n) {
m.addNotification({
type: e,
message: t,
details: n
});
}, k = function() {
a.disableAddForm = !1, a.newBinding.name = "", a.newBinding.namespace = h, a.newBinding.newRole = null;
}, j = function(e) {
l.list(S, e).then(function(e) {
var t = _.keys(e.by("metadata.name")).sort();
angular.extend(a, {
serviceAccounts: t,
refreshServiceAccounts: function(e) {
e && !_.includes(a.serviceAccounts, e) ? a.serviceAccounts = [ e ].concat(t) : a.serviceAccounts = t;
}
});
});
}, R = function(e) {
l.list(a.roleBindingsVersion, f, null, {
errorNotification: !1
}).then(function(e) {
angular.extend(a, {
canShowRoles: !0,
roleBindings: e.by("metadata.name"),
subjectKindsForUI: d.mapRolebindingsForUI(e.by("metadata.name"), C)
}), k();
}, function() {
e && (a.roleBindings[e.metadata.name] = e, a.subjectKindsForUI = d.mapRolebindingsForUI(a.roleBindings, C)), k();
});
}, I = function(t, n) {
a.disableAddForm = !0, p.create(t, n, h, f).then(function() {
R(), P("success", w.update.subject.success({
roleName: t.metadata.name,
subjectName: n.name
}));
}, function(a) {
k(), R(), P("error", w.update.subject.error({
roleName: t.metadata.name,
subjectName: n.name
}), e("getErrorDetails")(a));
});
}, T = function(t, n, r) {
a.disableAddForm = !0, p.addSubject(t, n, r, f).then(function() {
R(), P("success", w.update.subject.success({
roleName: t.roleRef.name,
subjectName: n.name
}));
}, function(a) {
k(), R(), P("error", w.update.subject.error({
roleName: t.roleRef.name,
subjectName: n.name
}), e("getErrorDetails")(a));
});
}, N = {};
n.tab && (N[n.tab] = !0);
var A = d.getSubjectKinds();
angular.extend(a, {
selectedTab: N,
projectName: h,
forms: {},
subjectKinds: A,
newBinding: {
role: "",
kind: n.tab || "User",
name: ""
},
toggleEditMode: function() {
k(), a.mode.edit = !a.mode.edit;
},
mode: {
edit: !1
},
selectTab: function(e) {
a.newBinding.kind = e, a.newBinding.name = "";
}
}), angular.extend(a, {
excludeExistingRoles: function(e) {
return function(t) {
return !_.some(e, {
kind: t.kind,
metadata: {
name: t.metadata.name
}
});
};
},
roleHelp: function(e) {
if (e) {
var t = _.get(e, "metadata.namespace"), n = _.get(e, "metadata.name"), a = t ? t + " / " + n + ": " : "";
return e ? a + (y(e, "description") || "") : "";
}
}
});
var E = function(e, t, n, r) {
var o = {
title: "Confirm Removal",
alerts: {},
detailsMarkup: w.remove.areYouSure.html.subject({
roleName: n,
kindName: v(t),
subjectName: e
}),
okButtonText: "Remove",
okButtonClass: "btn-danger",
cancelButtonText: "Cancel"
};
return _.isEqual(e, r) && (o.detailsMarkup = w.remove.areYouSure.html.self({
roleName: n,
subjectName: e
}), d.isLastRole(a.user.metadata.name, a.roleBindings) && (o.alerts.currentUserLabelRole = {
type: "error",
message: w.notice.yourLastRole({
roleName: n
})
})), _.isEqual(t, "ServiceAccount") && _.startsWith(n, "system:") && (o.alerts.editingServiceAccountRole = {
type: "error",
message: w.warning.serviceAccount()
}), o;
};
s.withUser().then(function(e) {
a.user = e;
}), u.list().then(function(e) {
var t = _.keys(e.by("metadata.name")).sort();
angular.extend(a, {
projects: t,
selectProject: function(e) {
a.newBinding.name = "", j({
namespace: e
});
},
refreshProjects: function(e) {
e && !_.includes(a.projects, e) ? a.projects = [ e ].concat(t) : a.projects = t;
}
});
}), u.get(n.project).then(_.spread(function(n, r) {
f = r, R(), j(f), angular.extend(a, {
project: n,
subjectKinds: A,
canUpdateRolebindings: b("rolebindings", "update", h),
confirmRemove: function(n, r, i, s) {
var l = null, u = E(n, r, i, a.user.metadata.name);
_.isEqual(n, a.user.metadata.name) && d.isLastRole(a.user.metadata.name, a.roleBindings) && (l = !0), o.open({
templateUrl: "views/modals/confirm.html",
controller: "ConfirmModalController",
resolve: {
modalConfig: function() {
return u;
}
}
}).result.then(function() {
p.removeSubject(n, i, s, a.roleBindings, f).then(function(e) {
l ? t.url("catalog") : (c.getProjectRules(h, !0).then(function() {
R(e[0]);
var t = b("rolebindings", "update", h);
angular.extend(a, {
canUpdateRolebindings: t,
mode: {
edit: !!a.mode.edit && t
}
});
}), P("success", w.remove.success({
roleName: i,
subjectName: n
})));
}, function(t) {
P("error", w.remove.error({
roleName: i,
subjectName: n
}), e("getErrorDetails")(t));
});
});
},
addRoleTo: function(e, t, n, r) {
var o = {
name: e,
kind: t
};
"ServiceAccount" === t && (o.namespace = r);
var i = _.find(a.roleBindings, {
roleRef: {
name: n.metadata.name
}
});
i && _.some(i.subjects, o) ? P("error", w.update.subject.exists({
roleName: n.metadata.name,
subjectName: e
})) : i ? T(i, o, r) : I(n, o);
}
}), g.listAllRoles(f, {
errorNotification: !1
}).then(function(e) {
C = d.mapRolesForUI(_.head(e).by("metadata.name"), _.last(e).by("metadata.name"));
var t = d.sortRoles(C), n = d.filterRoles(C), r = function(e, t) {
return _.some(t, {
metadata: {
name: e
}
});
};
R(), angular.extend(a, {
toggle: {
roles: !1
},
filteredRoles: n,
toggleRoles: function() {
a.toggle.roles = !a.toggle.roles, a.toggle.roles ? a.filteredRoles = t : (a.filteredRoles = n, r(a.newBinding.role, n) || (a.newBinding.role = null));
}
});
});
}));
} ]), angular.module("openshiftConsole").controller("BuildsController", [ "$filter", "$location", "$routeParams", "$scope", "APIService", "BuildsService", "DataService", "LabelFilter", "Logger", "ProjectsService", function(e, t, n, a, r, o, i, s, c, l) {
a.projectName = n.project, a.builds = {}, a.unfilteredBuildConfigs = {}, a.buildConfigs = void 0, a.labelSuggestions = {}, a.latestByConfig = {}, a.clearFilter = function() {
s.clear();
};
var u = e("buildConfigForBuild"), d = r.getPreferredVersion("builds"), m = r.getPreferredVersion("buildconfigs"), p = [];
l.get(n.project).then(_.spread(function(t, n) {
function r(e) {
var t = s.getLabelSelector();
if (t.isEmpty()) return !0;
var n = u(e) || "";
return n && a.unfilteredBuildConfigs[n] ? !!a.buildConfigs[n] : t.matches(e);
}
function l(e) {
if (u(e)) return !1;
var t = s.getLabelSelector();
return !!t.isEmpty() || t.matches(e);
}
function g() {
a.latestByConfig = o.latestBuildByConfig(a.builds, r), a.buildsNoConfig = _.pickBy(a.builds, l), angular.forEach(a.buildConfigs, function(e, t) {
a.latestByConfig[t] = a.latestByConfig[t] || null;
});
}
function f() {
var e = _.omitBy(a.latestByConfig, _.isNull);
a.filterWithZeroResults = !s.getLabelSelector().isEmpty() && _.isEmpty(a.buildConfigs) && _.isEmpty(e);
}
a.project = t;
var h = e("isJenkinsPipelineStrategy");
p.push(i.watch(d, n, function(e) {
a.buildsLoaded = !0, a.builds = _.omitBy(e.by("metadata.name"), h), g(), s.addLabelSuggestionsFromResources(a.builds, a.labelSuggestions), c.log("builds (subscribe)", a.builds);
})), p.push(i.watch(m, n, function(e) {
a.unfilteredBuildConfigs = _.omitBy(e.by("metadata.name"), h), s.addLabelSuggestionsFromResources(a.unfilteredBuildConfigs, a.labelSuggestions), s.setLabelSuggestions(a.labelSuggestions), a.buildConfigs = s.getLabelSelector().select(a.unfilteredBuildConfigs), g(), f(), c.log("buildconfigs (subscribe)", a.buildConfigs);
})), s.onActiveFiltersChanged(function(e) {
a.$evalAsync(function() {
a.buildConfigs = e.select(a.unfilteredBuildConfigs), g(), f();
});
}), a.$on("$destroy", function() {
i.unwatchAll(p);
});
}));
} ]), angular.module("openshiftConsole").controller("PipelinesController", [ "$filter", "$routeParams", "$scope", "APIService", "BuildsService", "Constants", "DataService", "Logger", "Navigate", "ProjectsService", function(e, t, n, a, r, o, i, s, c, l) {
n.projectName = t.project, n.alerts = n.alerts || {}, n.buildConfigs = {};
var u = a.getPreferredVersion("builds"), d = a.getPreferredVersion("templates");
n.buildConfigsVersion = a.getPreferredVersion("buildconfigs"), n.buildConfigsInstantiateVersion = a.getPreferredVersion("buildconfigs/instantiate");
var m = [];
l.get(t.project).then(_.spread(function(t, a) {
n.project = t;
var s = {}, l = e("buildConfigForBuild"), p = e("isIncompleteBuild"), g = e("isJenkinsPipelineStrategy"), f = e("isNewerResource"), h = function(e, t) {
if (!p(t)) {
n.statsByConfig[e] || (n.statsByConfig[e] = {
count: 0,
totalDuration: 0
});
var a = n.statsByConfig[e];
a.count++, a.totalDuration += r.getDuration(t), a.avgDuration = _.round(a.totalDuration / a.count);
}
}, v = function() {
var e = {}, t = {};
n.statsByConfig = {}, _.each(s, function(a) {
if (g(a)) {
var r = l(a) || "";
n.buildConfigs[r] || (n.buildConfigs[r] = null), p(a) ? _.set(e, [ r, a.metadata.name ], a) : f(a, t[r]) && (t[r] = a), h(r, a);
}
}), _.each(t, function(t, n) {
_.set(e, [ n, t.metadata.name ], t);
}), n.interestingBuildsByConfig = e;
};
m.push(i.watch(u, a, function(e) {
n.buildsLoaded = !0, s = e.by("metadata.name"), v();
}));
var y = !1;
m.push(i.watch(n.buildConfigsVersion, a, function(e) {
if (n.buildConfigsLoaded = !0, n.buildConfigs = _.pickBy(e.by("metadata.name"), g), _.isEmpty(n.buildConfigs) && !y && (y = !0, o.SAMPLE_PIPELINE_TEMPLATE)) {
var t = o.SAMPLE_PIPELINE_TEMPLATE.name, a = o.SAMPLE_PIPELINE_TEMPLATE.namespace;
i.get(d, t, {
namespace: a
}, {
errorNotification: !1
}).then(function(e) {
n.createSampleURL = c.createFromTemplateURL(e, n.projectName);
});
}
v();
})), n.startBuild = r.startBuild, n.$on("$destroy", function() {
i.unwatchAll(m);
});
}));
} ]), angular.module("openshiftConsole").controller("BuildConfigController", [ "$scope", "$filter", "$routeParams", "APIService", "AuthorizationService", "BuildsService", "ImagesService", "DataService", "LabelFilter", "ModalsService", "NotificationsService", "ProjectsService", "SecretsService", "keyValueEditorUtils", function(e, t, n, a, r, o, i, s, c, l, u, d, m, p) {
e.projectName = n.project, e.buildConfigName = n.buildconfig, e.buildConfig = null, e.labelSuggestions = {}, e.alerts = {}, e.breadcrumbs = [], e.forms = {}, e.expand = {
imageEnv: !1
}, n.isPipeline ? e.breadcrumbs.push({
title: "Pipelines",
link: "project/" + n.project + "/browse/pipelines"
}) : e.breadcrumbs.push({
title: "Builds",
link: "project/" + n.project + "/browse/builds"
}), e.breadcrumbs.push({
title: n.buildconfig
}), e.buildConfigsVersion = a.getPreferredVersion("buildconfigs"), e.buildsVersion = a.getPreferredVersion("builds"), e.buildsLogVersion = a.getPreferredVersion("builds/log"), e.buildConfigsInstantiateVersion = a.getPreferredVersion("buildconfigs/instantiate"), e.eventsVersion = a.getPreferredVersion("events"), e.secretsVersion = a.getPreferredVersion("secrets"), e.emptyMessage = "Loading...", e.aceLoaded = function(e) {
var t = e.getSession();
t.setOption("tabSize", 2), t.setOption("useSoftTabs", !0), e.$blockScrolling = 1 / 0;
};
var g = t("buildConfigForBuild"), f = t("buildStrategy"), h = t("orderByDisplayName"), v = t("getErrorDetails"), y = [], b = [], S = [];
e.valueFromObjects = [];
var C = function(t) {
e.updatedBuildConfig = angular.copy(t), e.envVars = f(e.updatedBuildConfig).env || [];
};
e.compareTriggers = function(e, t) {
return _.isNumber(e.value) ? -1 : "ConfigChange" === e.value ? -1 : "ConfigChange" === t.value ? 1 : "ImageChange" === e.value ? -1 : "ImageChange" === t.value ? 1 : e.value.localeCompare(t.value);
}, e.saveEnvVars = function() {
u.hideNotification("save-bc-env-error"), e.envVars = _.filter(e.envVars, "name"), f(e.updatedBuildConfig).env = p.compactEntries(angular.copy(e.envVars)), s.update(e.buildConfigsVersion, n.buildconfig, e.updatedBuildConfig, e.projectContext).then(function() {
u.addNotification({
type: "success",
message: "Environment variables for build config " + e.buildConfigName + " were successfully updated."
}), e.forms.bcEnvVars.$setPristine();
}, function(n) {
u.addNotification({
id: "save-bc-env-error",
type: "error",
message: "An error occurred updating environment variables for build config " + e.buildConfigName + ".",
details: t("getErrorDetails")(n)
});
});
}, e.clearEnvVarUpdates = function() {
C(e.buildConfig), e.forms.bcEnvVars.$setPristine();
};
var w, P = function(n, r) {
e.loaded = !0, e.buildConfig = n, e.buildConfigPaused = o.isPaused(e.buildConfig), e.buildConfig.spec.source.images && (e.imageSources = e.buildConfig.spec.source.images, e.imageSourcesPaths = [], e.imageSources.forEach(function(n) {
e.imageSourcesPaths.push(t("destinationSourcePair")(n.paths));
}));
var c = _.get(f(n), "from", {}), l = c.kind + "/" + c.name + "/" + (c.namespace || e.projectName);
w !== l && (_.includes([ "ImageStreamTag", "ImageStreamImage" ], c.kind) ? (w = l, s.get(a.kindToResource(c.kind), c.name, {
namespace: c.namespace || e.projectName
}, {
errorNotification: !1
}).then(function(t) {
e.BCEnvVarsFromImage = i.getEnvironment(t);
}, function() {
e.BCEnvVarsFromImage = [];
})) : e.BCEnvVarsFromImage = []), C(n), "DELETED" === r && (e.alerts.deleted = {
type: "warning",
message: "This build configuration has been deleted."
}, e.buildConfigDeleted = !0), !e.forms.bcEnvVars || e.forms.bcEnvVars.$pristine ? C(n) : e.alerts.background_update = {
type: "warning",
message: "This build configuration has been updated in the background. Saving your changes may create a conflict or cause loss of data.",
links: [ {
label: "Reload Environment Variables",
onClick: function() {
return e.clearEnvVarUpdates(), !0;
}
} ]
}, e.paused = o.isPaused(e.buildConfig);
};
d.get(n.project).then(_.spread(function(a, i) {
function d() {
c.getLabelSelector().isEmpty() || !$.isEmptyObject(e.builds) || $.isEmptyObject(e.unfilteredBuilds) ? delete e.alerts.builds : e.alerts.builds = {
type: "warning",
details: "The active filters are hiding all builds."
};
}
e.project = a, e.projectContext = i, s.get(e.buildConfigsVersion, n.buildconfig, i, {
errorNotification: !1
}).then(function(t) {
P(t), y.push(s.watchObject(e.buildConfigsVersion, n.buildconfig, i, P));
}, function(n) {
e.loaded = !0, e.alerts.load = {
type: "error",
message: 404 === n.status ? "This build configuration can not be found, it may have been deleted." : "The build configuration details could not be loaded.",
details: 404 === n.status ? "Any remaining build history for this build will be shown." : t("getErrorDetails")(n)
};
}), s.list("configmaps", i, null, {
errorNotification: !1
}).then(function(t) {
b = h(t.by("metadata.name")), e.valueFromObjects = b.concat(S);
}, function(e) {
403 !== e.code && u.addNotification({
id: "build-config-list-config-maps-error",
type: "error",
message: "Could not load config maps.",
details: v(e)
});
}), r.canI(e.secretsVersion, "list", n.project) && s.list("secrets", i, null, {
errorNotification: !1
}).then(function(t) {
S = h(t.by("metadata.name")), e.webhookSecrets = m.groupSecretsByType(t).webhook, e.valueFromObjects = b.concat(S);
}, function(e) {
403 !== e.code && u.addNotification({
id: "build-config-list-secrets-error",
type: "error",
message: "Could not load secrets.",
details: v(e)
});
}), y.push(s.watch(e.buildsVersion, i, function(t, a, r) {
if (e.emptyMessage = "No builds to show", a) {
if (g(r) === n.buildconfig) {
var i = r.metadata.name;
switch (a) {
case "ADDED":
case "MODIFIED":
e.unfilteredBuilds[i] = r;
break;

case "DELETED":
delete e.unfilteredBuilds[i];
}
}
} else e.unfilteredBuilds = o.validatedBuildsForBuildConfig(n.buildconfig, t.by("metadata.name"));
e.builds = c.getLabelSelector().select(e.unfilteredBuilds), d(), c.addLabelSuggestionsFromResources(e.unfilteredBuilds, e.labelSuggestions), c.setLabelSuggestions(e.labelSuggestions), e.orderedBuilds = o.sortBuilds(e.builds, !0), e.latestBuild = _.head(e.orderedBuilds);
}, {
http: {
params: {
labelSelector: t("labelName")("buildConfig") + "=" + _.truncate(e.buildConfigName, {
length: 63,
omission: ""
})
}
}
})), c.onActiveFiltersChanged(function(t) {
e.$apply(function() {
e.builds = t.select(e.unfilteredBuilds), e.orderedBuilds = o.sortBuilds(e.builds, !0), e.latestBuild = _.head(e.orderedBuilds), d();
});
}), e.startBuild = function() {
o.startBuild(e.buildConfig);
}, e.showJenkinsfileExamples = function() {
l.showJenkinsfileExamples();
}, e.$on("$destroy", function() {
s.unwatchAll(y);
});
}));
} ]), angular.module("openshiftConsole").controller("BuildController", [ "$scope", "$filter", "$routeParams", "APIService", "BuildsService", "DataService", "ModalsService", "Navigate", "ProjectsService", function(e, t, n, a, r, o, i, s, c) {
e.projectName = n.project, e.build = null, e.buildConfig = null, e.buildConfigName = n.buildconfig, e.builds = {}, e.alerts = {}, e.showSecret = !1, e.renderOptions = {
hideFilterWidget: !0
}, e.breadcrumbs = [], n.isPipeline ? (e.breadcrumbs.push({
title: "Pipelines",
link: "project/" + n.project + "/browse/pipelines"
}), n.buildconfig && e.breadcrumbs.push({
title: n.buildconfig,
link: "project/" + n.project + "/browse/pipelines/" + n.buildconfig
})) : (e.breadcrumbs.push({
title: "Builds",
link: "project/" + n.project + "/browse/builds"
}), n.buildconfig && e.breadcrumbs.push({
title: n.buildconfig,
link: "project/" + n.project + "/browse/builds/" + n.buildconfig
})), e.breadcrumbs.push({
title: n.build
}), e.buildsVersion = a.getPreferredVersion("builds"), e.buildsCloneVersion = a.getPreferredVersion("builds/clone"), e.buildsLogVersion = a.getPreferredVersion("builds/log"), e.buildConfigsVersion = a.getPreferredVersion("buildconfigs"), e.eventsVersion = a.getPreferredVersion("events"), e.podsVersion = a.getPreferredVersion("pods");
var l, u = t("annotation"), d = [], m = function(t) {
e.logCanRun = !_.includes([ "New", "Pending", "Error" ], t.status.phase);
}, p = function() {
e.buildConfig ? e.canBuild = r.canBuild(e.buildConfig) : e.canBuild = !1;
};
c.get(n.project).then(_.spread(function(a, s) {
e.project = a, e.projectContext = s, e.logOptions = {};
var c = function() {
e.eventObjects = l ? [ e.build, l ] : [ e.build ];
}, g = function(t, n) {
e.loaded = !0, e.build = t, m(t), c();
var a = u(t, "buildNumber");
a && e.breadcrumbs[2] && (e.breadcrumbs[2].title = "#" + a), "DELETED" === n && (e.alerts.deleted = {
type: "warning",
message: "This build has been deleted."
});
var r;
l || (r = u(t, "buildPod")) && o.get(e.podsVersion, r, s, {
errorNotification: !1
}).then(function(e) {
l = e, c();
});
}, f = function(t, n) {
"DELETED" === n && (e.alerts.deleted = {
type: "warning",
message: "Build configuration " + e.buildConfigName + " has been deleted."
}, e.buildConfigDeleted = !0), e.buildConfig = t, e.buildConfigPaused = r.isPaused(e.buildConfig), p();
};
o.get(e.buildsVersion, n.build, s, {
errorNotification: !1
}).then(function(t) {
g(t), d.push(o.watchObject(e.buildsVersion, n.build, s, g)), d.push(o.watchObject(e.buildConfigsVersion, n.buildconfig, s, f));
}, function(n) {
e.loaded = !0, e.alerts.load = {
type: "error",
message: "The build details could not be loaded.",
details: t("getErrorDetails")(n)
};
}), e.toggleSecret = function() {
e.showSecret = !0;
}, e.cancelBuild = function() {
r.cancelBuild(e.build, e.buildConfigName);
}, e.cloneBuild = function() {
e.build && e.canBuild && r.cloneBuild(e.build, e.buildConfigName);
}, e.showJenkinsfileExamples = function() {
i.showJenkinsfileExamples();
}, e.$on("$destroy", function() {
o.unwatchAll(d);
});
}));
} ]), angular.module("openshiftConsole").controller("ImageController", [ "$filter", "$scope", "$routeParams", "APIService", "DataService", "ImageStreamsService", "imageLayers", "ProjectsService", function(e, t, n, a, r, o, i, s) {
function c(e, a) {
var r = o.tagsByName(e);
t.imageStream = e, t.tagsByName = r, t.tagName = n.tag;
var i = r[n.tag];
i ? (delete t.alerts.load, m(i, a)) : t.alerts.load = {
type: "error",
message: "The image tag was not found in the stream."
};
}
t.projectName = n.project, t.imageStream = null, t.image = null, t.layers = null, t.tagsByName = {}, t.alerts = {}, t.renderOptions = t.renderOptions || {}, t.renderOptions.hideFilterWidget = !0, t.breadcrumbs = [ {
title: "Image Streams",
link: "project/" + n.project + "/browse/images"
}, {
title: n.imagestream,
link: "project/" + n.project + "/browse/images/" + n.imagestream
}, {
title: ":" + n.tag
} ];
var l = a.getPreferredVersion("imagestreamtags"), u = a.getPreferredVersion("imagestreams"), d = [], m = _.debounce(function(a, o) {
var s = n.imagestream + ":" + n.tag;
r.get(l, s, o).then(function(e) {
t.loaded = !0, t.image = e.image, t.layers = i(t.image);
}, function(n) {
t.loaded = !0, t.alerts.load = {
type: "error",
message: "The image details could not be loaded.",
details: e("getErrorDetails")(n)
};
});
}, 200), p = function(e, n, a) {
c(e, n), "DELETED" === a && (t.alerts.deleted = {
type: "warning",
message: "This image stream has been deleted."
});
};
s.get(n.project).then(_.spread(function(a, o) {
t.project = a, r.get(u, n.imagestream, o, {
errorNotification: !1
}).then(function(e) {
t.loaded = !0, p(e, o), d.push(r.watchObject(u, n.imagestream, o, function(e, t) {
p(e, o, t);
}));
}, function(n) {
t.loaded = !0, t.alerts.load = {
type: "error",
message: "The image stream details could not be loaded.",
details: e("getErrorDetails")(n)
};
}), t.$on("$destroy", function() {
r.unwatchAll(d);
});
}));
} ]), angular.module("openshiftConsole").controller("ImagesController", [ "$filter", "$routeParams", "$scope", "APIService", "DataService", "LabelFilter", "Logger", "ProjectsService", function(e, t, n, a, r, o, i, s) {
n.projectName = t.project, n.imageStreams = {}, n.missingStatusTagsByImageStream = {}, n.builds = {}, n.labelSuggestions = {}, n.clearFilter = function() {
o.clear();
};
var c, l = a.getPreferredVersion("imagestreams"), u = [];
s.get(t.project).then(_.spread(function(e, t) {
function a() {
_.each(c, function(e) {
var t = n.missingStatusTagsByImageStream[e.metadata.name] = {};
if (e.spec && e.spec.tags) {
var a = {};
e.status && e.status.tags && angular.forEach(e.status.tags, function(e) {
a[e.tag] = !0;
}), angular.forEach(e.spec.tags, function(e) {
a[e.name] || (t[e.name] = e);
});
}
});
}
function s() {
n.filterWithZeroResults = !o.getLabelSelector().isEmpty() && _.isEmpty(n.imageStreams) && !_.isEmpty(c);
}
n.project = e, u.push(r.watch(l, t, function(e) {
n.imageStreamsLoaded = !0, c = _.sortBy(e.by("metadata.name"), "metadata.name"), o.addLabelSuggestionsFromResources(c, n.labelSuggestions), o.setLabelSuggestions(n.labelSuggestions), n.imageStreams = o.getLabelSelector().select(c), a(), s(), i.log("image streams (subscribe)", n.imageStreams);
})), o.onActiveFiltersChanged(function(e) {
n.$evalAsync(function() {
n.imageStreams = e.select(c), s();
});
}), n.$on("$destroy", function() {
r.unwatchAll(u);
});
}));
} ]), angular.module("openshiftConsole").controller("ImageStreamController", [ "$filter", "$routeParams", "$scope", "APIService", "DataService", "ImageStreamsService", "Navigate", "ProjectsService", function(e, t, n, a, r, o, i, s) {
n.projectName = t.project, n.imageStream = null, n.tags = [], n.tagShowOlder = {}, n.alerts = {}, n.renderOptions = n.renderOptions || {}, n.renderOptions.hideFilterWidget = !0, n.breadcrumbs = [ {
title: "Image Streams",
link: "project/" + t.project + "/browse/images"
}, {
title: t.imagestream
} ], n.emptyMessage = "Loading...", n.imageStreamsVersion = a.getPreferredVersion("imagestreams");
var c = [];
s.get(t.project).then(_.spread(function(a, i) {
n.project = a, r.get(n.imageStreamsVersion, t.imagestream, i, {
errorNotification: !1
}).then(function(e) {
n.loaded = !0, n.imageStream = e, n.emptyMessage = "No tags to show", c.push(r.watchObject(n.imageStreamsVersion, t.imagestream, i, function(e, t) {
"DELETED" === t && (n.alerts.deleted = {
type: "warning",
message: "This image stream has been deleted."
}), n.imageStream = e, n.tags = _.toArray(o.tagsByName(n.imageStream));
}));
}, function(t) {
n.loaded = !0, n.alerts.load = {
type: "error",
message: "The image stream details could not be loaded.",
details: e("getErrorDetails")(t)
};
}), n.$on("$destroy", function() {
r.unwatchAll(c);
});
})), n.imagestreamPath = function(e, t) {
if (!t.status) return "";
var n = i.resourceURL(e.metadata.name, "ImageStream", e.metadata.namespace);
return t && (n += "/" + t.name), n;
};
} ]), angular.module("openshiftConsole").controller("DeploymentsController", [ "$scope", "$filter", "$routeParams", "APIService", "DataService", "DeploymentsService", "LabelFilter", "Logger", "OwnerReferencesService", "ProjectsService", function(e, t, n, a, r, o, i, s, c, l) {
function u() {
var t = _.isEmpty(e.unfilteredDeploymentConfigs) && _.isEmpty(e.unfilteredReplicationControllers) && _.isEmpty(e.unfilteredDeployments) && _.isEmpty(e.unfilteredReplicaSets), n = !i.getLabelSelector().isEmpty(), a = _.isEmpty(e.deploymentConfigs) && _.isEmpty(e.replicationControllersByDC[""]) && _.isEmpty(e.deployments) && _.isEmpty(e.replicaSets);
e.showEmptyState = t, e.filterWithZeroResults = n && a && !t;
}
e.projectName = n.project, e.replicationControllers = {}, e.unfilteredDeploymentConfigs = {}, e.unfilteredDeployments = {}, e.replicationControllersByDC = {}, e.labelSuggestions = {}, e.emptyMessage = "Loading...", e.expandedDeploymentConfigRow = {}, e.unfilteredReplicaSets = {}, e.unfilteredReplicationControllers = {}, e.showEmptyState = !0, e.clearFilter = function() {
i.clear();
};
var d, m, p = t("annotation"), g = a.getPreferredVersion("deployments"), f = a.getPreferredVersion("deploymentconfigs"), h = a.getPreferredVersion("replicationcontrollers"), v = a.getPreferredVersion("replicasets"), y = function() {
d && m && (e.replicaSetsByDeploymentUID = c.groupByControllerUID(d), e.unfilteredReplicaSets = _.get(e, [ "replicaSetsByDeploymentUID", "" ], {}), i.addLabelSuggestionsFromResources(e.unfilteredReplicaSets, e.labelSuggestions), i.setLabelSuggestions(e.labelSuggestions), e.replicaSets = i.getLabelSelector().select(e.unfilteredReplicaSets), e.latestReplicaSetByDeploymentUID = {}, _.each(e.replicaSetsByDeploymentUID, function(t, n) {
n && (e.latestReplicaSetByDeploymentUID[n] = o.getActiveReplicaSet(t, m[n]));
}), u());
}, b = [];
l.get(n.project).then(_.spread(function(n, a) {
e.project = n, b.push(r.watch(h, a, function(n, a, r) {
e.replicationControllers = n.by("metadata.name");
var c, l;
if (r && (c = p(r, "deploymentConfig"), l = r.metadata.name), e.replicationControllersByDC = o.associateDeploymentsToDeploymentConfig(e.replicationControllers, e.deploymentConfigs, !0), e.replicationControllersByDC[""] && (e.unfilteredReplicationControllers = e.replicationControllersByDC[""], i.addLabelSuggestionsFromResources(e.unfilteredReplicationControllers, e.labelSuggestions), i.setLabelSuggestions(e.labelSuggestions), e.replicationControllersByDC[""] = i.getLabelSelector().select(e.replicationControllersByDC[""])), u(), a) {
if ("ADDED" === a || "MODIFIED" === a && [ "New", "Pending", "Running" ].indexOf(t("deploymentStatus")(r)) > -1) e.deploymentConfigDeploymentsInProgress[c] = e.deploymentConfigDeploymentsInProgress[c] || {}, e.deploymentConfigDeploymentsInProgress[c][l] = r; else if ("MODIFIED" === a) {
var d = t("deploymentStatus")(r);
"Complete" !== d && "Failed" !== d || delete e.deploymentConfigDeploymentsInProgress[c][l];
}
} else e.deploymentConfigDeploymentsInProgress = o.associateRunningDeploymentToDeploymentConfig(e.replicationControllersByDC);
r ? "DELETED" !== a && (r.causes = t("deploymentCauses")(r)) : angular.forEach(e.replicationControllers, function(e) {
e.causes = t("deploymentCauses")(e);
}), s.log("replicationControllers (subscribe)", e.replicationControllers);
})), b.push(r.watch(v, a, function(t) {
d = t.by("metadata.name"), y(), s.log("replicasets (subscribe)", e.replicaSets);
})), b.push(r.watch(f, a, function(t) {
e.deploymentConfigsLoaded = !0, e.unfilteredDeploymentConfigs = t.by("metadata.name"), i.addLabelSuggestionsFromResources(e.unfilteredDeploymentConfigs, e.labelSuggestions), i.setLabelSuggestions(e.labelSuggestions), e.deploymentConfigs = i.getLabelSelector().select(e.unfilteredDeploymentConfigs), e.emptyMessage = "No deployment configurations to show", e.replicationControllersByDC = o.associateDeploymentsToDeploymentConfig(e.replicationControllers, e.deploymentConfigs, !0), e.replicationControllersByDC[""] && (e.unfilteredReplicationControllers = e.replicationControllersByDC[""], e.replicationControllersByDC[""] = i.getLabelSelector().select(e.replicationControllersByDC[""])), u(), s.log("deploymentconfigs (subscribe)", e.deploymentConfigs);
})), b.push(r.watch(g, a, function(t) {
m = e.unfilteredDeployments = t.by("metadata.uid"), i.addLabelSuggestionsFromResources(e.unfilteredDeployments, e.labelSuggestions), i.setLabelSuggestions(e.labelSuggestions), e.deployments = i.getLabelSelector().select(e.unfilteredDeployments), y(), s.log("deployments (subscribe)", e.unfilteredDeployments);
})), e.showDeploymentConfigTable = function() {
var t = _.size(e.replicationControllersByDC);
return t > 1 || 1 === t && !e.replicationControllersByDC[""];
}, i.onActiveFiltersChanged(function(t) {
e.$evalAsync(function() {
e.deploymentConfigs = t.select(e.unfilteredDeploymentConfigs), e.replicationControllersByDC = o.associateDeploymentsToDeploymentConfig(e.replicationControllers, e.deploymentConfigs, !0), e.replicationControllersByDC[""] && (e.unfilteredReplicationControllers = e.replicationControllersByDC[""], e.replicationControllersByDC[""] = i.getLabelSelector().select(e.replicationControllersByDC[""])), e.deployments = t.select(e.unfilteredDeployments), e.replicaSets = t.select(e.unfilteredReplicaSets), u();
});
}), e.$on("$destroy", function() {
r.unwatchAll(b);
});
}));
} ]), angular.module("openshiftConsole").controller("DeploymentController", [ "$scope", "$filter", "$routeParams", "APIService", "DataService", "DeploymentsService", "HPAService", "ImageStreamResolver", "LabelFilter", "Logger", "ModalsService", "Navigate", "OwnerReferencesService", "ProjectsService", "StorageService", function(e, t, n, a, r, o, i, s, c, l, u, d, m, p, g) {
var f = {};
e.projectName = n.project, e.name = n.deployment, e.replicaSetsForDeployment = {}, e.unfilteredReplicaSetsForDeployment = {}, e.labelSuggestions = {}, e.emptyMessage = "Loading...", e.forms = {}, e.alerts = {}, e.imagesByDockerReference = {}, e.breadcrumbs = [ {
title: "Deployments",
link: "project/" + n.project + "/browse/deployments"
}, {
title: n.deployment
} ];
var h = a.getPreferredVersion("builds"), v = a.getPreferredVersion("replicasets"), y = a.getPreferredVersion("limitranges"), b = a.getPreferredVersion("imagestreams");
e.deploymentsVersion = a.getPreferredVersion("deployments"), e.eventsVersion = a.getPreferredVersion("events"), e.horizontalPodAutoscalersVersion = a.getPreferredVersion("horizontalpodautoscalers"), e.healthCheckURL = d.healthCheckURL(n.project, "Deployment", n.deployment, e.deploymentsVersion.group);
var S = [];
p.get(n.project).then(_.spread(function(a, d) {
function p() {
c.getLabelSelector().isEmpty() || !_.isEmpty(e.replicaSetsForDeployment) || _.isEmpty(e.unfilteredReplicaSetsForDeployment) ? delete e.alerts["filter-hiding-all"] : e.alerts["filter-hiding-all"] = {
type: "warning",
details: "The active filters are hiding all rollout history."
};
}
e.project = a, e.projectContext = d;
var C = {}, w = function() {
i.getHPAWarnings(e.deployment, e.autoscalers, C, a).then(function(t) {
e.hpaWarnings = t;
});
};
r.get(e.deploymentsVersion, n.deployment, d, {
errorNotification: !1
}).then(function(t) {
e.loaded = !0, e.deployment = t, w(), S.push(r.watchObject(e.deploymentsVersion, n.deployment, d, function(t, n) {
"DELETED" === n && (e.alerts.deleted = {
type: "warning",
message: "This deployment has been deleted."
}), e.deployment = t, e.updatingPausedState = !1, w(), s.fetchReferencedImageStreamImages([ t.spec.template ], e.imagesByDockerReference, f, d);
})), S.push(r.watch(v, d, function(n) {
e.emptyMessage = "No deployments to show";
var a = n.by("metadata.name");
a = m.filterForController(a, t), e.inProgressDeployment = _.chain(a).filter("status.replicas").length > 1, e.unfilteredReplicaSetsForDeployment = o.sortByRevision(a), e.replicaSetsForDeployment = c.getLabelSelector().select(e.unfilteredReplicaSetsForDeployment), p(), c.addLabelSuggestionsFromResources(e.unfilteredReplicaSetsForDeployment, e.labelSuggestions), c.setLabelSuggestions(e.labelSuggestions);
}));
}, function(n) {
e.loaded = !0, e.alerts.load = {
type: "error",
message: 404 === n.status ? "This deployment can not be found, it may have been deleted." : "The deployment details could not be loaded.",
details: t("getErrorDetails")(n)
};
}), r.list(y, d).then(function(e) {
C = e.by("metadata.name"), w();
}), S.push(r.watch(b, d, function(t) {
var n = t.by("metadata.name");
s.buildDockerRefMapForImageStreams(n, f), e.deployment && s.fetchReferencedImageStreamImages([ e.deployment.spec.template ], e.imagesByDockerReference, f, d), l.log("imagestreams (subscribe)", e.imageStreams);
})), S.push(r.watch(e.horizontalPodAutoscalersVersion, d, function(t) {
e.autoscalers = i.filterHPA(t.by("metadata.name"), "Deployment", n.deployment), w();
})), S.push(r.watch(h, d, function(t) {
e.builds = t.by("metadata.name"), l.log("builds (subscribe)", e.builds);
})), c.onActiveFiltersChanged(function(t) {
e.$evalAsync(function() {
e.replicaSetsForDeployment = t.select(e.unfilteredReplicaSetsForDeployment), p();
});
}), e.scale = function(n) {
o.scale(e.deployment, n).then(_.noop, function(n) {
e.alerts = e.alerts || {}, e.alerts.scale = {
type: "error",
message: "An error occurred scaling the deployment.",
details: t("getErrorDetails")(n)
};
});
}, e.setPaused = function(n) {
e.updatingPausedState = !0, o.setPaused(e.deployment, n, d).then(_.noop, function(a) {
e.updatingPausedState = !1, e.alerts = e.alerts || {}, e.alerts.scale = {
type: "error",
message: "An error occurred " + (n ? "pausing" : "resuming") + " the deployment.",
details: t("getErrorDetails")(a)
};
});
}, e.removeVolume = function(t) {
var n;
n = _.get(e, "deployment.spec.paused") ? "This will remove the volume from the deployment." : "This will remove the volume from the deployment and start a new rollout.", t.persistentVolumeClaim ? n += " It will not delete the persistent volume claim." : t.secret ? n += " It will not delete the secret." : t.configMap && (n += " It will not delete the config map.");
u.confirm({
title: "Remove volume " + t.name + "?",
details: n,
okButtonText: "Remove",
okButtonClass: "btn-danger",
cancelButtonText: "Cancel"
}).then(function() {
g.removeVolume(e.deployment, t, d);
});
}, e.$on("$destroy", function() {
r.unwatchAll(S);
});
}));
} ]), angular.module("openshiftConsole").controller("DeploymentConfigController", [ "$scope", "$filter", "$routeParams", "APIService", "BreadcrumbsService", "DataService", "DeploymentsService", "HPAService", "ImageStreamResolver", "ModalsService", "Navigate", "NotificationsService", "Logger", "ProjectsService", "StorageService", "LabelFilter", "labelNameFilter", function(e, t, n, a, r, o, i, s, c, l, u, d, m, p, g, f, h) {
var v = {};
e.projectName = n.project, e.deploymentConfigName = n.deploymentconfig, e.deploymentConfig = null, e.deployments = {}, e.unfilteredDeployments = {}, e.imagesByDockerReference = {}, e.builds = {}, e.labelSuggestions = {}, e.forms = {}, e.alerts = {}, e.breadcrumbs = r.getBreadcrumbs({
name: n.deploymentconfig,
kind: "DeploymentConfig",
namespace: n.project
}), e.emptyMessage = "Loading...", e.deploymentConfigsInstantiateVersion = a.getPreferredVersion("deploymentconfigs/instantiate"), e.deploymentConfigsVersion = a.getPreferredVersion("deploymentconfigs"), e.eventsVersion = a.getPreferredVersion("events"), e.horizontalPodAutoscalersVersion = a.getPreferredVersion("horizontalpodautoscalers");
var y = a.getPreferredVersion("builds"), b = a.getPreferredVersion("imagestreams"), S = a.getPreferredVersion("limitranges"), C = a.getPreferredVersion("replicationcontrollers");
e.healthCheckURL = u.healthCheckURL(n.project, "DeploymentConfig", n.deploymentconfig, e.deploymentConfigsVersion.group);
var w = t("mostRecent"), P = t("orderObjectsByDate"), k = [];
p.get(n.project).then(_.spread(function(a, r) {
function u() {
f.getLabelSelector().isEmpty() || !$.isEmptyObject(e.deployments) || $.isEmptyObject(e.unfilteredDeployments) ? delete e.alerts.deployments : e.alerts.deployments = {
type: "warning",
details: "The active filters are hiding all deployments."
};
}
e.project = a, e.projectContext = r;
var d = {}, p = function() {
s.getHPAWarnings(e.deploymentConfig, e.autoscalers, d, a).then(function(t) {
e.hpaWarnings = t;
});
};
o.get(e.deploymentConfigsVersion, n.deploymentconfig, r, {
errorNotification: !1
}).then(function(a) {
e.loaded = !0, e.deploymentConfig = a, e.strategyParams = t("deploymentStrategyParams")(a), p(), k.push(o.watchObject(e.deploymentConfigsVersion, n.deploymentconfig, r, function(t, n) {
"DELETED" === n && (e.alerts.deleted = {
type: "warning",
message: "This deployment configuration has been deleted."
}), e.deploymentConfig = t, e.updatingPausedState = !1, p(), c.fetchReferencedImageStreamImages([ t.spec.template ], e.imagesByDockerReference, v, r);
}));
}, function(n) {
e.loaded = !0, e.alerts.load = {
type: "error",
message: 404 === n.status ? "This deployment configuration can not be found, it may have been deleted." : "The deployment configuration details could not be loaded.",
details: 404 === n.status ? "Any remaining deployment history for this deployment will be shown." : t("getErrorDetails")(n)
};
}), k.push(o.watch(C, r, function(a, r, o) {
var s = n.deploymentconfig;
if (e.emptyMessage = "No deployments to show", r) {
if (i.deploymentBelongsToConfig(o, n.deploymentconfig)) {
var c = o.metadata.name;
switch (r) {
case "ADDED":
case "MODIFIED":
e.unfilteredDeployments[c] = o, t("deploymentIsInProgress")(o) ? (e.deploymentConfigDeploymentsInProgress[s] = e.deploymentConfigDeploymentsInProgress[s] || {}, e.deploymentConfigDeploymentsInProgress[s][c] = o) : e.deploymentConfigDeploymentsInProgress[s] && delete e.deploymentConfigDeploymentsInProgress[s][c], o.causes = t("deploymentCauses")(o);
break;

case "DELETED":
delete e.unfilteredDeployments[c], e.deploymentConfigDeploymentsInProgress[s] && delete e.deploymentConfigDeploymentsInProgress[s][c];
}
}
} else {
var l = i.associateDeploymentsToDeploymentConfig(a.by("metadata.name"));
e.unfilteredDeployments = l[n.deploymentconfig] || {}, angular.forEach(e.unfilteredDeployments, function(e) {
e.causes = t("deploymentCauses")(e);
}), e.deploymentConfigDeploymentsInProgress = i.associateRunningDeploymentToDeploymentConfig(l);
}
e.deployments = f.getLabelSelector().select(e.unfilteredDeployments), e.orderedDeployments = P(e.deployments, !0), e.deploymentInProgress = !!_.size(e.deploymentConfigDeploymentsInProgress[s]), e.mostRecent = w(e.unfilteredDeployments), u(), f.addLabelSuggestionsFromResources(e.unfilteredDeployments, e.labelSuggestions), f.setLabelSuggestions(e.labelSuggestions);
}, {
http: {
params: {
labelSelector: h("deploymentConfig") + "=" + e.deploymentConfigName
}
}
})), o.list(S, r).then(function(e) {
d = e.by("metadata.name"), p();
}), k.push(o.watch(b, r, function(t) {
var n = t.by("metadata.name");
c.buildDockerRefMapForImageStreams(n, v), e.deploymentConfig && c.fetchReferencedImageStreamImages([ e.deploymentConfig.spec.template ], e.imagesByDockerReference, v, r), m.log("imagestreams (subscribe)", e.imageStreams);
})), k.push(o.watch(y, r, function(t) {
e.builds = t.by("metadata.name"), m.log("builds (subscribe)", e.builds);
})), k.push(o.watch(e.horizontalPodAutoscalersVersion, r, function(t) {
e.autoscalers = s.filterHPA(t.by("metadata.name"), "DeploymentConfig", n.deploymentconfig), p();
})), f.onActiveFiltersChanged(function(t) {
e.$apply(function() {
e.deployments = t.select(e.unfilteredDeployments), e.orderedDeployments = P(e.deployments, !0), u();
});
}), e.canDeploy = function() {
return !!e.deploymentConfig && (!e.deploymentConfig.metadata.deletionTimestamp && (!e.deploymentInProgress && !e.deploymentConfig.spec.paused));
}, e.startLatestDeployment = function() {
e.canDeploy() && i.startLatestDeployment(e.deploymentConfig, r);
}, e.scale = function(n) {
i.scale(e.deploymentConfig, n).then(_.noop, function(n) {
e.alerts["scale-error"] = {
type: "error",
message: "An error occurred scaling the deployment config.",
details: t("getErrorDetails")(n)
};
});
}, e.setPaused = function(n) {
e.updatingPausedState = !0, i.setPaused(e.deploymentConfig, n, r).then(_.noop, function(a) {
e.updatingPausedState = !1, e.alerts["pause-error"] = {
type: "error",
message: "An error occurred " + (n ? "pausing" : "resuming") + " the deployment config.",
details: t("getErrorDetails")(a)
};
});
};
var j = function() {
if (_.get(e, "deploymentConfig.spec.paused")) return !1;
var t = _.get(e, "deploymentConfig.spec.triggers", []);
return _.some(t, {
type: "ConfigChange"
});
};
e.removeVolume = function(t) {
var n;
n = j() ? "This will remove the volume from the deployment config and trigger a new deployment." : "This will remove the volume from the deployment config.", t.persistentVolumeClaim ? n += " It will not delete the persistent volume claim." : t.secret ? n += " It will not delete the secret." : t.configMap && (n += " It will not delete the config map.");
l.confirm({
title: "Remove volume " + t.name + "?",
details: n,
okButtonText: "Remove",
okButtonClass: "btn-danger",
cancelButtonText: "Cancel"
}).then(function() {
g.removeVolume(e.deploymentConfig, t, r);
});
}, e.$on("$destroy", function() {
o.unwatchAll(k);
});
}));
} ]), angular.module("openshiftConsole").controller("ReplicaSetController", [ "$scope", "$filter", "$routeParams", "APIService", "AuthorizationService", "BreadcrumbsService", "DataService", "DeploymentsService", "HPAService", "ImageStreamResolver", "keyValueEditorUtils", "kind", "Logger", "MetricsService", "ModalsService", "Navigate", "OwnerReferencesService", "PodsService", "ProjectsService", "StorageService", function(e, t, n, a, r, o, i, s, c, l, u, d, m, p, g, f, h, v, y, b) {
var S = !1, C = t("annotation"), w = t("humanizeKind")(d), P = t("hasDeployment"), k = a.getPreferredVersion("builds"), j = a.getPreferredVersion("imagestreams"), R = a.getPreferredVersion("horizontalpodautoscalers"), I = a.getPreferredVersion("limitranges"), T = a.getPreferredVersion("pods"), N = a.getPreferredVersion("replicasets"), A = a.getPreferredVersion("replicationcontrollers"), E = a.getPreferredVersion("resourcequotas"), D = a.getPreferredVersion("appliedclusterresourcequotas");
switch (d) {
case "ReplicaSet":
e.resource = N, e.healthCheckURL = f.healthCheckURL(n.project, "ReplicaSet", n.replicaSet, "extensions");
break;

case "ReplicationController":
e.resource = A, e.healthCheckURL = f.healthCheckURL(n.project, "ReplicationController", n.replicaSet);
}
var $ = {};
e.projectName = n.project, e.kind = d, e.replicaSet = null, e.deploymentConfig = null, e.deploymentConfigMissing = !1, e.imagesByDockerReference = {}, e.builds = {}, e.alerts = {}, e.renderOptions = e.renderOptions || {}, e.renderOptions.hideFilterWidget = !0, e.forms = {}, e.logOptions = {}, e.deploymentsVersion = a.getPreferredVersion("deployments"), e.deploymentConfigsVersion = a.getPreferredVersion("deploymentconfigs"), e.eventsVersion = a.getPreferredVersion("events"), e.deploymentConfigsLogVersion = "deploymentconfigs/log";
var B = [];
p.isAvailable().then(function(t) {
e.metricsAvailable = t;
});
var L = t("deploymentStatus"), V = function(t) {
e.logCanRun = !_.includes([ "New", "Pending" ], L(t));
}, U = t("isIE")();
y.get(n.project).then(_.spread(function(a, u) {
e.project = a, e.projectContext = u;
var p = {}, y = function() {
if (e.hpaForRS = c.filterHPA(p, d, n.replicaSet), e.deploymentConfigName && e.isActive) {
var t = c.filterHPA(p, "DeploymentConfig", e.deploymentConfigName);
e.autoscalers = e.hpaForRS.concat(t);
} else if (e.deployment && e.isActive) {
var a = c.filterHPA(p, "Deployment", e.deployment.metadata.name);
e.autoscalers = e.hpaForRS.concat(a);
} else e.autoscalers = e.hpaForRS;
}, A = function() {
B.push(i.watch(e.resource, u, function(t) {
var n, a = [];
angular.forEach(t.by("metadata.name"), function(t) {
(C(t, "deploymentConfig") || "") === e.deploymentConfigName && a.push(t);
}), n = s.getActiveDeployment(a), e.isActive = n && n.metadata.uid === e.replicaSet.metadata.uid, y();
}));
}, O = function() {
c.getHPAWarnings(e.replicaSet, e.autoscalers, e.limitRanges, a).then(function(t) {
e.hpaWarnings = t;
});
}, F = function(a) {
var r = C(a, "deploymentConfig");
if (r) {
S = !0, e.deploymentConfigName = r;
var o = C(a, "deploymentVersion");
o && (e.logOptions.version = o), e.healthCheckURL = f.healthCheckURL(n.project, "DeploymentConfig", r), i.get(e.deploymentConfigsVersion, r, u, {
errorNotification: !1
}).then(function(t) {
e.deploymentConfig = t;
}, function(n) {
404 !== n.status ? e.alerts.load = {
type: "error",
message: "The deployment configuration details could not be loaded.",
details: t("getErrorDetails")(n)
} : e.deploymentConfigMissing = !0;
});
}
}, x = function() {
e.isActive = s.isActiveReplicaSet(e.replicaSet, e.deployment);
}, M = function(t) {
return _.some(t, function(t) {
if (_.get(t, "status.replicas") && _.get(t, "metadata.uid") !== _.get(e.replicaSet, "metadata.uid")) {
var n = h.getControllerReferences(t);
return _.some(n, {
uid: e.deployment.metadata.uid
});
}
});
}, q = !1, z = function() {
var t = h.getControllerReferences(e.replicaSet), a = _.find(t, {
kind: "Deployment"
});
a && i.get(e.deploymentsVersion, a.name, u).then(function(t) {
e.deployment = t, e.healthCheckURL = f.healthCheckURL(n.project, "Deployment", t.metadata.name, "apps"), B.push(i.watchObject(e.deploymentsVersion, t.metadata.name, u, function(t, a) {
if ("DELETED" === a) return e.alerts["deployment-deleted"] = {
type: "warning",
message: "The deployment controlling this replica set has been deleted."
}, e.healthCheckURL = f.healthCheckURL(n.project, "ReplicaSet", n.replicaSet, "extensions"), e.deploymentMissing = !0, void delete e.deployment;
e.deployment = t, e.breadcrumbs = o.getBreadcrumbs({
object: e.replicaSet,
displayName: "#" + s.getRevision(e.replicaSet),
parent: {
title: e.deployment.metadata.name,
link: f.resourceURL(e.deployment)
},
humanizedKind: "Deployments"
}), x(), y();
})), B.push(i.watch(N, u, function(e) {
var t = e.by("metadata.name");
q = M(t);
}));
});
}, H = function() {
if (!_.isEmpty($)) {
var t = _.get(e, "replicaSet.spec.template");
t && l.fetchReferencedImageStreamImages([ t ], e.imagesByDockerReference, $, u);
}
};
i.get(e.resource, n.replicaSet, u, {
errorNotification: !1
}).then(function(t) {
switch (e.loaded = !0, e.replicaSet = t, V(t), d) {
case "ReplicationController":
F(t);
break;

case "ReplicaSet":
z();
}
O(), e.breadcrumbs = o.getBreadcrumbs({
object: t
}), B.push(i.watchObject(e.resource, n.replicaSet, u, function(t, n) {
"DELETED" === n && (e.alerts.deleted = {
type: "warning",
message: "This " + w + " has been deleted."
}), e.replicaSet = t, V(t), O(), H(), e.deployment && x();
})), e.deploymentConfigName && A(), B.push(i.watch(T, u, function(t) {
var n = t.by("metadata.name");
e.podsForDeployment = v.filterForOwner(n, e.replicaSet);
}));
}, function(a) {
e.loaded = !0, e.alerts.load = {
type: "error",
message: "The " + w + " details could not be loaded.",
details: t("getErrorDetails")(a)
}, e.breadcrumbs = o.getBreadcrumbs({
name: n.replicaSet,
kind: d,
namespace: n.project
});
}), B.push(i.watch(e.resource, u, function(n, a, r) {
e.replicaSets = n.by("metadata.name"), "ReplicationController" === d && (e.deploymentsByDeploymentConfig = s.associateDeploymentsToDeploymentConfig(e.replicaSets));
var o, i;
r && (o = C(r, "deploymentConfig"), i = r.metadata.name), e.deploymentConfigDeploymentsInProgress = e.deploymentConfigDeploymentsInProgress || {}, a ? "ADDED" === a || "MODIFIED" === a && t("deploymentIsInProgress")(r) ? (e.deploymentConfigDeploymentsInProgress[o] = e.deploymentConfigDeploymentsInProgress[o] || {}, e.deploymentConfigDeploymentsInProgress[o][i] = r) : "MODIFIED" === a && e.deploymentConfigDeploymentsInProgress[o] && delete e.deploymentConfigDeploymentsInProgress[o][i] : e.deploymentConfigDeploymentsInProgress = s.associateRunningDeploymentToDeploymentConfig(e.deploymentsByDeploymentConfig), r ? "DELETED" !== a && (r.causes = t("deploymentCauses")(r)) : angular.forEach(e.replicaSets, function(e) {
e.causes = t("deploymentCauses")(e);
});
})), B.push(i.watch(j, u, function(e) {
var t = e.by("metadata.name");
l.buildDockerRefMapForImageStreams(t, $), H(), m.log("imagestreams (subscribe)", t);
})), B.push(i.watch(k, u, function(t) {
e.builds = t.by("metadata.name"), m.log("builds (subscribe)", e.builds);
})), B.push(i.watch(R, u, function(e) {
p = e.by("metadata.name"), y(), O();
}, {
poll: U,
pollInterval: 6e4
})), i.list(I, u).then(function(t) {
e.limitRanges = t.by("metadata.name"), O();
});
B.push(i.watch(E, u, function(t) {
e.quotas = t.by("metadata.name");
}, {
poll: !0,
pollInterval: 6e4
})), B.push(i.watch(D, u, function(t) {
e.clusterQuotas = t.by("metadata.name");
}, {
poll: !0,
pollInterval: 6e4
}));
var K = t("deploymentIsLatest");
e.showRollbackAction = function() {
return "Complete" === L(e.replicaSet) && !K(e.replicaSet, e.deploymentConfig) && !e.replicaSet.metadata.deletionTimestamp && r.canI("deploymentconfigrollbacks", "create");
}, e.retryFailedDeployment = function(t) {
s.retryFailedDeployment(t, u, e);
}, e.rollbackToDeployment = function(t, n, a, r) {
s.rollbackToDeployment(t, n, a, r, u, e);
}, e.cancelRunningDeployment = function(e) {
s.cancelRunningDeployment(e, u);
}, e.scale = function(n) {
var a = e.deployment || e.deploymentConfig || e.replicaSet;
s.scale(a, n).then(_.noop, function(n) {
e.alerts = e.alerts || {}, e.alerts.scale = {
type: "error",
message: "An error occurred scaling.",
details: t("getErrorDetails")(n)
};
});
};
var W = t("hasDeploymentConfig");
e.isScalable = function() {
return !!_.isEmpty(e.autoscalers) && (!W(e.replicaSet) && !P(e.replicaSet) || (!(!e.deploymentConfigMissing && !e.deploymentMissing) || !(!e.deploymentConfig && !e.deployment) && (e.isActive && !q)));
}, e.removeVolume = function(n) {
var a = "This will remove the volume from the " + t("humanizeKind")(e.replicaSet.kind) + ".";
n.persistentVolumeClaim ? a += " It will not delete the persistent volume claim." : n.secret ? a += " It will not delete the secret." : n.configMap && (a += " It will not delete the config map.");
g.confirm({
title: "Remove volume " + n.name + "?",
details: a,
okButtonText: "Remove",
okButtonClass: "btn-danger",
cancelButtonText: "Cancel"
}).then(function() {
b.removeVolume(e.replicaSet, n, u);
});
}, e.$on("$destroy", function() {
i.unwatchAll(B);
});
}));
} ]), angular.module("openshiftConsole").controller("StatefulSetsController", [ "$scope", "$routeParams", "APIService", "DataService", "ProjectsService", "LabelFilter", "PodsService", function(e, t, n, a, r, o, i) {
e.projectName = t.project, e.labelSuggestions = {}, e.clearFilter = function() {
o.clear();
};
var s = n.getPreferredVersion("pods"), c = n.getPreferredVersion("statefulsets"), l = [];
r.get(t.project).then(_.spread(function(t, n) {
function r() {
e.filterWithZeroResults = !o.getLabelSelector().isEmpty() && _.isEmpty(e.statefulSets) && !_.isEmpty(e.unfilteredStatefulSets);
}
e.project = t, l.push(a.watch(c, n, function(t) {
angular.extend(e, {
loaded: !0,
unfilteredStatefulSets: t.by("metadata.name")
}), e.statefulSets = o.getLabelSelector().select(e.unfilteredStatefulSets), o.addLabelSuggestionsFromResources(e.unfilteredStatefulSets, e.labelSuggestions), o.setLabelSuggestions(e.labelSuggestions), r();
})), l.push(a.watch(s, n, function(t) {
e.pods = t.by("metadata.name"), e.podsByOwnerUID = i.groupByOwnerUID(e.pods);
})), o.onActiveFiltersChanged(function(t) {
e.$evalAsync(function() {
e.statefulSets = t.select(e.unfilteredStatefulSets), r();
});
}), e.$on("$destroy", function() {
a.unwatchAll(l);
});
}));
} ]), angular.module("openshiftConsole").controller("StatefulSetController", [ "$filter", "$scope", "$routeParams", "APIService", "BreadcrumbsService", "DataService", "MetricsService", "ProjectsService", "PodsService", function(e, t, n, a, r, o, i, s, c) {
t.projectName = n.project, t.statefulSetName = n.statefulset, t.forms = {}, t.alerts = {}, t.breadcrumbs = r.getBreadcrumbs({
name: t.statefulSetName,
kind: "StatefulSet",
namespace: n.project
});
var l = a.getPreferredVersion("pods"), u = a.getPreferredVersion("resourcequotas"), d = a.getPreferredVersion("appliedclusterresourcequotas");
t.statefulSetsVersion = a.getPreferredVersion("statefulsets");
var m, p = [];
i.isAvailable().then(function(e) {
t.metricsAvailable = e;
}), s.get(n.project).then(_.spread(function(n, a) {
m = a, o.get(t.statefulSetsVersion, t.statefulSetName, a, {
errorNotification: !1
}).then(function(e) {
angular.extend(t, {
project: n,
projectContext: a,
statefulSet: e,
loaded: !0,
isScalable: function() {
return !1;
},
scale: function() {}
}), p.push(o.watchObject(t.statefulSetsVersion, t.statefulSetName, a, function(e) {
t.statefulSet = e;
})), p.push(o.watch(l, a, function(n) {
var a = n.by("metadata.name");
t.podsForStatefulSet = c.filterForOwner(a, e);
}));
p.push(o.watch(u, a, function(e) {
t.quotas = e.by("metadata.name");
}, {
poll: !0,
pollInterval: 6e4
})), p.push(o.watch(d, a, function(e) {
t.clusterQuotas = e.by("metadata.name");
}, {
poll: !0,
pollInterval: 6e4
}));
}, function(n) {
t.loaded = !0, t.alerts.load = {
type: "error",
message: "The stateful set details could not be loaded.",
details: e("getErrorDetails")(n)
};
});
})), t.$on("$destroy", function() {
o.unwatchAll(p);
});
} ]), angular.module("openshiftConsole").controller("ServicesController", [ "$filter", "$routeParams", "$scope", "APIService", "DataService", "ProjectsService", "LabelFilter", "Logger", function(e, t, n, a, r, o, i, s) {
n.projectName = t.project, n.services = {}, n.unfilteredServices = {}, n.routesByService = {}, n.routes = {}, n.labelSuggestions = {}, n.clearFilter = function() {
i.clear();
};
var c = a.getPreferredVersion("services"), l = [];
o.get(t.project).then(_.spread(function(e, t) {
function a() {
n.filterWithZeroResults = !i.getLabelSelector().isEmpty() && _.isEmpty(n.services) && !_.isEmpty(n.unfilteredServices);
}
n.project = e, l.push(r.watch(c, t, function(e) {
n.servicesLoaded = !0, n.unfilteredServices = e.by("metadata.name"), i.addLabelSuggestionsFromResources(n.unfilteredServices, n.labelSuggestions), i.setLabelSuggestions(n.labelSuggestions), n.services = i.getLabelSelector().select(n.unfilteredServices), a(), s.log("services (subscribe)", n.unfilteredServices);
})), i.onActiveFiltersChanged(function(e) {
n.$evalAsync(function() {
n.services = e.select(n.unfilteredServices), a();
});
}), n.$on("$destroy", function() {
r.unwatchAll(l);
});
}));
} ]), angular.module("openshiftConsole").controller("ServiceController", [ "$scope", "$routeParams", "APIService", "DataService", "Logger", "ProjectsService", "$filter", function(e, t, n, a, r, o, i) {
e.projectName = t.project, e.service = null, e.services = null, e.alerts = {}, e.renderOptions = e.renderOptions || {}, e.renderOptions.hideFilterWidget = !0, e.breadcrumbs = [ {
title: "Services",
link: "project/" + t.project + "/browse/services"
}, {
title: t.service
} ], e.podFailureReasons = {
Pending: "This pod will not receive traffic until all of its containers have been created."
};
var s = n.getPreferredVersion("pods"), c = n.getPreferredVersion("endpoints");
e.eventsVersion = n.getPreferredVersion("events"), e.routesVersion = n.getPreferredVersion("routes"), e.servicesVersion = n.getPreferredVersion("services");
var l = {}, u = [], d = function() {
e.service && (e.portsByRoute = {}, _.each(e.service.spec.ports, function(t) {
var n = !1;
t.nodePort && (e.showNodePorts = !0), _.each(e.routesForService, function(a) {
a.spec.port && a.spec.port.targetPort !== t.name && a.spec.port.targetPort !== t.targetPort || (e.portsByRoute[a.metadata.name] = e.portsByRoute[a.metadata.name] || [], e.portsByRoute[a.metadata.name].push(t), n = !0);
}), n || (e.portsByRoute[""] = e.portsByRoute[""] || [], e.portsByRoute[""].push(t));
}));
}, m = function() {
if (e.podsForService = {}, e.service) {
var t = new LabelSelector(e.service.spec.selector);
e.podsForService = t.select(l);
}
}, p = function(t, n) {
e.loaded = !0, e.service = t, m(), d(), "DELETED" === n && (e.alerts.deleted = {
type: "warning",
message: "This service has been deleted."
});
};
o.get(t.project).then(_.spread(function(n, o) {
e.project = n, e.projectContext = o, a.get(e.servicesVersion, t.service, o, {
errorNotification: !1
}).then(function(n) {
p(n), u.push(a.watchObject(e.servicesVersion, t.service, o, p));
}, function(t) {
e.loaded = !0, e.alerts.load = {
type: "error",
message: "The service details could not be loaded.",
details: i("getErrorDetails")(t)
};
}), u.push(a.watch(e.servicesVersion, o, function(t) {
e.services = t.by("metadata.name");
})), u.push(a.watch(s, o, function(e) {
l = e.by("metadata.name"), m();
})), u.push(a.watch(c, o, function(n) {
e.podsWithEndpoints = {};
var a = n.by("metadata.name")[t.service];
a && _.each(a.subsets, function(t) {
_.each(t.addresses, function(t) {
"Pod" === _.get(t, "targetRef.kind") && (e.podsWithEndpoints[t.targetRef.name] = !0);
});
});
})), u.push(a.watch(e.routesVersion, o, function(n) {
e.routesForService = {}, angular.forEach(n.by("metadata.name"), function(n) {
"Service" === n.spec.to.kind && n.spec.to.name === t.service && (e.routesForService[n.metadata.name] = n);
}), d(), r.log("routes (subscribe)", e.routesForService);
})), e.$on("$destroy", function() {
a.unwatchAll(u);
});
}));
} ]), angular.module("openshiftConsole").controller("ServiceInstancesController", [ "$scope", "$filter", "$routeParams", "APIService", "BindingService", "Constants", "DataService", "LabelFilter", "Logger", "ProjectsService", function(e, t, n, a, r, o, i, s, c, l) {
e.bindingsByInstanceRef = {}, e.labelSuggestions = {}, e.projectName = n.project, e.serviceClasses = {}, e.serviceInstances = {}, e.unfilteredServiceInstances = {}, e.clearFilter = function() {
s.clear();
};
var u = a.getPreferredVersion("servicebindings"), d = a.getPreferredVersion("clusterserviceclasses");
e.serviceInstancesVersion = a.getPreferredVersion("serviceinstances");
var m = [], p = function() {
e.serviceInstances = s.getLabelSelector().select(e.unfilteredServiceInstances);
}, g = function() {
e.unfilteredServiceInstances = r.sortServiceInstances(e.unfilteredServiceInstances, e.serviceClasses);
};
e.getServiceClass = function(t) {
var n = _.get(t, "spec.clusterServiceClassRef.name");
return _.get(e, [ "serviceClasses", n ]);
}, l.get(n.project).then(_.spread(function(t, n) {
function a() {
e.filterWithZeroResults = !s.getLabelSelector().isEmpty() && _.isEmpty(e.serviceInstances) && !_.isEmpty(e.unfilteredServiceInstances);
}
e.project = t, e.projectContext = n, m.push(i.watch(u, n, function(t) {
var n = t.by("metadata.name");
e.bindingsByInstanceRef = _.groupBy(n, "spec.instanceRef.name");
})), m.push(i.watch(e.serviceInstancesVersion, n, function(t) {
e.serviceInstancesLoaded = !0, e.unfilteredServiceInstances = t.by("metadata.name"), g(), p(), a(), s.addLabelSuggestionsFromResources(e.unfilteredServiceInstances, e.labelSuggestions), s.setLabelSuggestions(e.labelSuggestions), c.log("provisioned services (subscribe)", e.unfilteredServiceInstances);
})), i.list(d, {}, function(t) {
e.serviceClasses = t.by("metadata.name"), g(), p();
}), s.onActiveFiltersChanged(function(t) {
e.$evalAsync(function() {
e.serviceInstances = t.select(e.unfilteredServiceInstances), a();
});
}), e.$on("$destroy", function() {
i.unwatchAll(m);
});
}));
} ]), angular.module("openshiftConsole").controller("ServiceInstanceController", [ "$scope", "$filter", "$routeParams", "APIService", "BindingService", "AuthorizationService", "Catalog", "DataService", "Logger", "ProjectsService", "SecretsService", "ServiceInstancesService", function(e, t, n, a, r, o, i, s, c, l, u, d) {
e.alerts = {}, e.projectName = n.project, e.serviceInstance = null, e.serviceClass = null, e.serviceClasses = null, e.editDialogShown = !1, e.breadcrumbs = [ {
title: "Provisioned Services",
link: "project/" + n.project + "/browse/service-instances"
} ], e.deprovision = function() {
e.serviceInstance.metadata.deletionTimestamp || d.deprovision(e.serviceInstance, e.bindings);
}, e.showEditDialog = function() {
e.editDialogShown = !0;
}, e.showParameterValues = !1, e.toggleShowParameterValues = function() {
e.showParameterValues = !e.showParameterValues;
}, e.closeEditDialog = function() {
e.editDialogShown = !1;
};
var m = a.getPreferredVersion("servicebindings");
e.eventsVersion = a.getPreferredVersion("events"), e.serviceInstancesVersion = a.getPreferredVersion("serviceinstances");
var p, g, f = [], h = [], v = t("serviceInstanceDisplayName"), y = t("isServiceInstanceFailed"), b = function() {
e.breadcrumbs.push({
title: e.displayName
});
}, S = function() {
if (e.serviceInstance && e.parameterSchema) {
s.unwatchAll(h), h = [], e.allowParametersReveal = o.canI("secrets", "get", e.projectName), e.parameterData = {}, e.opaqueParameterKeys = [];
var t = e.allowParametersReveal ? "" : "*****";
_.each(_.keys(_.get(e.parameterSchema, "properties")), function(n) {
e.parameterData[n] = t;
});
var n = _.get(e.serviceInstance, "status.externalProperties.parameters", {});
_.each(_.keys(n), function(t) {
"<redacted>" === n[t] ? e.parameterData[t] = "*****" : (e.parameterData[t] = n[t], e.opaqueParameterKeys.push(t));
}), e.allowParametersReveal && _.each(_.get(e.serviceInstance, "spec.parametersFrom"), function(t) {
h.push(s.watchObject("secrets", _.get(t, "secretKeyRef.name"), e.projectContext, function(n) {
try {
var a = JSON.parse(u.decodeSecretData(n.data)[t.secretKeyRef.key]);
_.extend(e.parameterData, a);
} catch (e) {
c.warn("Unable to load parameters from secret " + _.get(t, "secretKeyRef.name"), e);
}
}));
});
}
}, C = function() {
if (e.plan && e.serviceClass && e.serviceInstance) {
var t = _.get(e.plan, "spec.instanceUpdateParameterSchema"), n = _.size(_.get(t, "properties")) > 0 || _.get(e.serviceClass, "spec.planUpdatable") && _.size(e.servicePlans) > 1;
e.editAvailable = n && !y(e.serviceInstance) && !_.get(e.serviceInstance, "status.asyncOpInProgress") && !_.get(e.serviceInstance, "metadata.deletionTimestamp");
}
}, w = function() {
e.parameterFormDefinition = angular.copy(_.get(e.plan, "spec.externalMetadata.schemas.service_instance.update.openshift_form_definition")), e.parameterSchema = _.get(e.plan, "spec.instanceCreateParameterSchema"), S();
}, P = function() {
var t = _.get(e.serviceInstance, "spec.clusterServicePlanRef.name");
e.plan = _.find(e.servicePlans, {
metadata: {
name: t
}
}), w(), C();
}, k = function() {
e.serviceClass && !g && (e.servicePlans ? P() : g = i.getServicePlansForServiceClass(e.serviceClass).then(function(t) {
var n = _.get(e.serviceInstance, "spec.clusterServicePlanRef.name");
e.servicePlans = _.reject(t.by("metadata.name"), function(e) {
return _.get(e, "status.removedFromBrokerCatalog") && e.metadata.name !== n;
}), P(), g = null;
}));
}, j = function() {
e.serviceInstance && !p && (e.serviceClass ? k() : p = d.fetchServiceClassForInstance(e.serviceInstance).then(function(t) {
e.serviceClass = t, e.displayName = v(e.serviceInstance, e.serviceClass), b(), p = null, k();
}));
}, R = function(t, n) {
e.loaded = !0, e.serviceInstance = t, "DELETED" === n && (e.alerts.deleted = {
type: "warning",
message: "This provisioned service has been deleted."
}), j(), S(), C();
};
l.get(n.project).then(_.spread(function(a, o) {
e.project = a, e.projectContext = o, s.get(e.serviceInstancesVersion, n.instance, o, {
errorNotification: !1
}).then(function(t) {
R(t), f.push(s.watchObject(e.serviceInstancesVersion, n.instance, o, R)), f.push(s.watch(m, o, function(n) {
var a = n.by("metadata.name");
e.bindings = r.getBindingsForResource(a, t);
}));
}, function(n) {
e.loaded = !0, e.alerts.load = {
type: "error",
message: "The provisioned service details could not be loaded.",
details: t("getErrorDetails")(n)
};
});
}, function(n) {
e.loaded = !0, e.alerts.load = {
type: "error",
message: "The service details could not be loaded.",
details: t("getErrorDetails")(n)
};
})), e.$on("$destroy", function() {
s.unwatchAll(f), s.unwatchAll(h);
});
} ]), angular.module("openshiftConsole").controller("SecretsController", [ "$routeParams", "$scope", "APIService", "DataService", "LabelFilter", "ProjectsService", function(e, t, n, a, r, o) {
t.projectName = e.project, t.labelSuggestions = {}, t.clearFilter = function() {
r.clear();
}, t.secretsVersion = n.getPreferredVersion("secrets");
var i = [];
o.get(e.project).then(_.spread(function(e, n) {
function o() {
t.filterWithZeroResults = !r.getLabelSelector().isEmpty() && _.isEmpty(t.secrets) && !_.isEmpty(t.unfilteredSecrets);
}
t.project = e, t.context = n, i.push(a.watch(t.secretsVersion, n, function(e) {
t.unfilteredSecrets = _.sortBy(e.by("metadata.name"), [ "type", "metadata.name" ]), t.secretsLoaded = !0, r.addLabelSuggestionsFromResources(t.unfilteredSecrets, t.labelSuggestions), r.setLabelSuggestions(t.labelSuggestions), t.secrets = r.getLabelSelector().select(t.unfilteredSecrets), o();
})), r.onActiveFiltersChanged(function(e) {
t.$evalAsync(function() {
t.secrets = e.select(t.unfilteredSecrets), o();
});
}), t.$on("$destroy", function() {
a.unwatchAll(i);
});
}));
} ]), angular.module("openshiftConsole").controller("SecretController", [ "$routeParams", "$filter", "$scope", "APIService", "DataService", "ProjectsService", "SecretsService", function(e, t, n, a, r, o, i) {
n.projectName = e.project, n.secretName = e.secret, n.view = {
showSecret: !1
}, n.alerts = n.alerts || {}, n.breadcrumbs = [ {
title: "Secrets",
link: "project/" + e.project + "/browse/secrets"
}, {
title: n.secretName
} ], n.secretsVersion = a.getPreferredVersion("secrets");
var s = [], c = function(e, t) {
n.secret = e, "DELETED" !== t ? n.decodedSecretData = i.decodeSecretData(n.secret.data) : n.alerts.deleted = {
type: "warning",
message: "This secret has been deleted."
};
};
n.addToApplicationVisible = !1, n.addToApplication = function() {
n.secret.data && (n.addToApplicationVisible = !0);
}, n.closeAddToApplication = function() {
n.addToApplicationVisible = !1;
}, o.get(e.project).then(_.spread(function(e, a) {
n.project = e, n.context = a, r.get(n.secretsVersion, n.secretName, a, {
errorNotification: !1
}).then(function(e) {
n.loaded = !0, c(e), s.push(r.watchObject(n.secretsVersion, n.secretName, a, c));
}, function(e) {
n.loaded = !0, n.alerts.load = {
type: "error",
message: "The secret details could not be loaded.",
details: t("getErrorDetails")(e)
};
}), n.$on("$destroy", function() {
r.unwatchAll(s);
});
}));
} ]), angular.module("openshiftConsole").controller("CreateSecretController", [ "$filter", "$location", "$routeParams", "$scope", "$window", "ApplicationGenerator", "AuthorizationService", "DataService", "Navigate", "ProjectsService", function(e, t, n, a, r, o, i, s, c, l) {
a.alerts = {}, a.projectName = n.project, a.breadcrumbs = [ {
title: "Secrets",
link: "project/" + a.projectName + "/browse/secrets"
}, {
title: "Create Secret"
} ], l.get(n.project).then(_.spread(function(e, o) {
a.project = e, a.context = o, i.canI("secrets", "create", n.project) ? a.navigateBack = function() {
n.then ? t.url(n.then) : r.history.back();
} : c.toErrorPage("You do not have authority to create secrets in project " + n.project + ".", "access_denied");
}));
} ]), angular.module("openshiftConsole").controller("ConfigMapsController", [ "$scope", "$routeParams", "APIService", "DataService", "LabelFilter", "ProjectsService", function(e, t, n, a, r, o) {
e.projectName = t.project, e.loaded = !1, e.labelSuggestions = {}, e.configMapsVersion = n.getPreferredVersion("configmaps"), e.clearFilter = function() {
r.clear();
};
var i, s = [], c = function() {
e.filterWithZeroResults = !r.getLabelSelector().isEmpty() && _.isEmpty(e.configMaps) && !_.isEmpty(i);
}, l = function() {
r.addLabelSuggestionsFromResources(i, e.labelSuggestions), r.setLabelSuggestions(e.labelSuggestions);
}, u = function() {
var t = r.getLabelSelector().select(i);
e.configMaps = _.sortBy(t, "metadata.name"), c();
};
o.get(t.project).then(_.spread(function(t, n) {
e.project = t, s.push(a.watch(e.configMapsVersion, n, function(t) {
i = t.by("metadata.name"), l(), u(), e.loaded = !0;
})), r.onActiveFiltersChanged(function() {
e.$evalAsync(u);
}), e.$on("$destroy", function() {
a.unwatchAll(s);
});
}));
} ]), angular.module("openshiftConsole").controller("ConfigMapController", [ "$scope", "$routeParams", "APIService", "BreadcrumbsService", "DataService", "ProjectsService", function(e, t, n, a, r, o) {
e.projectName = t.project, e.alerts = e.alerts || {}, e.loaded = !1, e.labelSuggestions = {}, e.breadcrumbs = a.getBreadcrumbs({
name: t.configMap,
kind: "ConfigMap",
namespace: t.project
}), e.configMapsVersion = n.getPreferredVersion("configmaps");
var i = [], s = function(t, n) {
e.loaded = !0, e.configMap = t, "DELETED" === n && (e.alerts.deleted = {
type: "warning",
message: "This config map has been deleted."
});
};
e.addToApplicationVisible = !1, e.addToApplication = function() {
e.addToApplicationVisible = !0;
}, e.closeAddToApplication = function() {
e.addToApplicationVisible = !1;
}, o.get(t.project).then(_.spread(function(n, a) {
e.project = n, r.get(e.configMapsVersion, t.configMap, a, {
errorNotification: !1
}).then(function(e) {
s(e), i.push(r.watchObject("configmaps", t.configMap, a, s));
}, function(t) {
e.loaded = !0, e.error = t;
}), e.$on("$destroy", function() {
r.unwatchAll(i);
});
}));
} ]), angular.module("openshiftConsole").controller("CreateConfigMapController", [ "$filter", "$routeParams", "$scope", "$window", "APIService", "AuthorizationService", "DataService", "Navigate", "NotificationsService", "ProjectsService", function(e, t, n, a, r, o, i, s, c, l) {
n.projectName = t.project, n.breadcrumbs = [ {
title: "Config Maps",
link: "project/" + n.projectName + "/browse/config-maps"
}, {
title: "Create Config Map"
} ];
var u = function() {
c.hideNotification("create-config-map-error");
};
n.$on("$destroy", u);
var d = function() {
a.history.back();
};
n.cancel = d, l.get(t.project).then(_.spread(function(a, l) {
n.project = a, o.canI("configmaps", "create", t.project) ? (n.configMap = {
apiVersion: "v1",
kind: "ConfigMap",
metadata: {
namespace: t.project
},
data: {}
}, n.createConfigMap = function() {
if (n.createConfigMapForm.$valid) {
u(), n.disableInputs = !0;
var t = r.objectToResourceGroupVersion(n.configMap);
i.create(t, null, n.configMap, l).then(function() {
c.addNotification({
type: "success",
message: "Config map " + n.configMap.metadata.name + " successfully created."
}), d();
}, function(t) {
n.disableInputs = !1, c.addNotification({
id: "create-config-map-error",
type: "error",
message: "An error occurred creating the config map.",
details: e("getErrorDetails")(t)
});
});
}
}) : s.toErrorPage("You do not have authority to create config maps in project " + t.project + ".", "access_denied");
}));
} ]), angular.module("openshiftConsole").controller("RoutesController", [ "$filter", "$routeParams", "$scope", "APIService", "DataService", "LabelFilter", "ProjectsService", function(e, t, n, a, r, o, i) {
n.projectName = t.project, n.unfilteredRoutes = {}, n.routes = {}, n.labelSuggestions = {}, n.clearFilter = function() {
o.clear();
};
var s = a.getPreferredVersion("services");
n.routesVersion = a.getPreferredVersion("routes");
var c = [];
i.get(t.project).then(_.spread(function(e, t) {
function a() {
n.filterWithZeroResults = !o.getLabelSelector().isEmpty() && _.isEmpty(n.routes) && !_.isEmpty(n.unfilteredRoutes);
}
n.project = e, c.push(r.watch(n.routesVersion, t, function(e) {
n.routesLoaded = !0, n.unfilteredRoutes = e.by("metadata.name"), o.addLabelSuggestionsFromResources(n.unfilteredRoutes, n.labelSuggestions), o.setLabelSuggestions(n.labelSuggestions), n.routes = o.getLabelSelector().select(n.unfilteredRoutes), a();
})), c.push(r.watch(s, t, function(e) {
n.services = e.by("metadata.name");
})), o.onActiveFiltersChanged(function(e) {
n.$evalAsync(function() {
n.routes = e.select(n.unfilteredRoutes), a();
});
}), n.$on("$destroy", function() {
r.unwatchAll(c);
});
}));
} ]), angular.module("openshiftConsole").controller("RouteController", [ "$scope", "$filter", "$routeParams", "AlertMessageService", "APIService", "DataService", "ProjectsService", "RoutesService", function(e, t, n, a, r, o, i, s) {
e.projectName = n.project, e.route = null, e.alerts = {}, e.renderOptions = e.renderOptions || {}, e.renderOptions.hideFilterWidget = !0, e.breadcrumbs = [ {
title: "Routes",
link: "project/" + n.project + "/browse/routes"
}, {
title: n.route
} ];
var c = r.getPreferredVersion("services");
e.routesVersion = r.getPreferredVersion("routes");
var l, u = [], d = function(t, n) {
e.loaded = !0, e.route = t, l = s.isCustomHost(t), "DELETED" === n && (e.alerts.deleted = {
type: "warning",
message: "This route has been deleted."
});
}, m = function(t) {
return "router-host-" + _.get(e, "route.metadata.uid") + "-" + t.host + "-" + t.routerCanonicalHostname;
};
e.showRouterHostnameAlert = function(t, n) {
if (!l) return !1;
if (!t || !t.host || !t.routerCanonicalHostname) return !1;
if (!n || "True" !== n.status) return !1;
var r = m(t);
return !a.isAlertPermanentlyHidden(r, e.projectName);
}, i.get(n.project).then(_.spread(function(a, r) {
e.project = a, o.get(e.routesVersion, n.route, r, {
errorNotification: !1
}).then(function(t) {
d(t), u.push(o.watchObject(e.routesVersion, n.route, r, d));
}, function(n) {
e.loaded = !0, e.alerts.load = {
type: "error",
message: "The route details could not be loaded.",
details: t("getErrorDetails")(n)
};
}), u.push(o.watch(c, r, function(t) {
e.services = t.by("metadata.name");
})), e.$on("$destroy", function() {
o.unwatchAll(u);
});
}));
} ]), angular.module("openshiftConsole").controller("StorageController", [ "$filter", "$routeParams", "$scope", "APIService", "AlertMessageService", "DataService", "LabelFilter", "Logger", "ProjectsService", "QuotaService", function(e, t, n, a, r, o, i, s, c, l) {
n.projectName = t.project, n.pvcs = {}, n.unfilteredPVCs = {}, n.labelSuggestions = {}, n.alerts = n.alerts || {}, n.outOfClaims = !1, n.clearFilter = function() {
i.clear();
};
var u = function() {
var e = r.isAlertPermanentlyHidden("storage-quota-limit-reached", n.projectName);
if (n.outOfClaims = l.isAnyStorageQuotaExceeded(n.quotas, n.clusterQuotas), !e && n.outOfClaims) {
if (n.alerts.quotaExceeded) return;
n.alerts.quotaExceeded = {
type: "warning",
message: "Storage quota limit has been reached. You will not be able to create any new storage.",
links: [ {
href: "project/" + n.projectName + "/quota",
label: "View Quota"
}, {
href: "",
label: "Don't Show Me Again",
onClick: function() {
return r.permanentlyHideAlert("storage-quota-limit-reached", n.projectName), !0;
}
} ]
};
} else delete n.alerts.quotaExceeded;
}, d = a.getPreferredVersion("resourcequotas"), m = a.getPreferredVersion("appliedclusterresourcequotas");
n.persistentVolumeClaimsVersion = a.getPreferredVersion("persistentvolumeclaims");
var p = [];
c.get(t.project).then(_.spread(function(e, t) {
function a() {
n.filterWithZeroResults = !i.getLabelSelector().isEmpty() && $.isEmptyObject(n.pvcs) && !$.isEmptyObject(n.unfilteredPVCs);
}
n.project = e, p.push(o.watch(n.persistentVolumeClaimsVersion, t, function(e) {
n.pvcsLoaded = !0, n.unfilteredPVCs = e.by("metadata.name"), i.addLabelSuggestionsFromResources(n.unfilteredPVCs, n.labelSuggestions), i.setLabelSuggestions(n.labelSuggestions), n.pvcs = i.getLabelSelector().select(n.unfilteredPVCs), a(), s.log("pvcs (subscribe)", n.unfilteredPVCs);
})), i.onActiveFiltersChanged(function(e) {
n.$evalAsync(function() {
n.pvcs = e.select(n.unfilteredPVCs), a();
});
}), n.$on("$destroy", function() {
o.unwatchAll(p);
}), o.list(d, {
namespace: n.projectName
}, function(e) {
n.quotas = e.by("metadata.name"), u();
}), o.list(m, {
namespace: n.projectName
}, function(e) {
n.clusterQuotas = e.by("metadata.name"), u();
});
}));
} ]), angular.module("openshiftConsole").controller("OtherResourcesController", [ "$routeParams", "$location", "$scope", "AuthorizationService", "DataService", "ProjectsService", "$filter", "LabelFilter", "Logger", "APIService", function(e, t, n, a, r, o, i, s, c, l) {
function u() {
n.filterWithZeroResults = !s.getLabelSelector().isEmpty() && _.isEmpty(n.resources) && !_.isEmpty(n.unfilteredResources);
}
function d() {
var e = n.kindSelector.selected;
if (e) {
var a = t.search();
a.kind = e.kind, a.group = e.group || "", t.replace().search(a), n.selectedResource = {
resource: l.kindToResource(e.kind),
group: e.group || ""
}, r.list({
group: e.group,
resource: l.kindToResource(e.kind)
}, n.context).then(function(t) {
n.unfilteredResources = t.by("metadata.name"), n.labelSuggestions = {}, s.addLabelSuggestionsFromResources(n.unfilteredResources, n.labelSuggestions), s.setLabelSuggestions(n.labelSuggestions), n.resources = s.getLabelSelector().select(n.unfilteredResources), n.resourceName = l.kindToResource(e.kind, !0), u();
});
}
}
n.projectName = e.project, n.labelSuggestions = {}, n.kindSelector = {
disabled: !0
}, n.kinds = _.filter(l.availableKinds(), function(e) {
switch (e.kind) {
case "AppliedClusterResourceQuota":
case "Build":
case "BuildConfig":
case "ConfigMap":
case "Deployment":
case "DeploymentConfig":
case "Event":
case "ImageStream":
case "ImageStreamImage":
case "ImageStreamImport":
case "ImageStreamMapping":
case "ImageStreamTag":
case "LimitRange":
case "PersistentVolumeClaim":
case "Pod":
case "ReplicaSet":
case "ReplicationController":
case "ResourceQuota":
case "Route":
case "Secret":
case "Service":
case "ServiceInstance":
case "StatefulSet":
return !1;

default:
return !0;
}
}), n.clearFilter = function() {
s.clear();
};
var m = function(e) {
if (e) {
var t = l.kindToResourceGroupVersion(e), n = l.apiInfo(t);
return !n || !n.verbs || _.includes(n.verbs, "list");
}
};
n.getReturnURL = function() {
var t = _.get(n, "kindSelector.selected.kind");
return t ? URI.expand("project/{projectName}/browse/other?kind={kind}&group={group}", {
projectName: e.project,
kind: t,
group: _.get(n, "kindSelector.selected.group", "")
}).toString() : "";
};
var p;
n.isDuplicateKind = function(e) {
return p || (p = _.countBy(n.kinds, "kind")), p[e] > 1;
};
var g = function(e, t) {
return _.some(n.kinds, function(n) {
return n.kind === e && (!n.group && !t || n.group === t);
});
};
o.get(e.project).then(_.spread(function(t, r) {
n.kinds = _.filter(n.kinds, function(e) {
var t = {
resource: l.kindToResource(e.kind),
group: e.group || ""
};
return !!m(e) && (!!a.checkResource(t.resource) && a.canI(t, "list", n.projectName));
}), n.project = t, n.context = r, n.kindSelector.disabled = !1, e.kind && g(e.kind, e.group) && (_.set(n, "kindSelector.selected.kind", e.kind), _.set(n, "kindSelector.selected.group", e.group || ""));
})), n.loadKind = d, n.$watch("kindSelector.selected", function() {
s.clear(), d();
});
var f = i("humanizeKind");
n.matchKind = function(e, t) {
return -1 !== f(e).toLowerCase().indexOf(t.toLowerCase());
}, s.onActiveFiltersChanged(function(e) {
n.$evalAsync(function() {
n.resources = e.select(n.unfilteredResources), u();
});
});
} ]), angular.module("openshiftConsole").controller("PersistentVolumeClaimController", [ "$filter", "$scope", "$routeParams", "APIService", "DataService", "ProjectsService", function(e, t, n, a, r, o) {
t.projectName = n.project, t.pvc = null, t.alerts = {}, t.renderOptions = t.renderOptions || {}, t.renderOptions.hideFilterWidget = !0, t.breadcrumbs = [ {
title: "Storage",
link: "project/" + n.project + "/browse/storage"
}, {
title: n.pvc
} ], t.storageClassesVersion = a.getPreferredVersion("storageclasses"), t.pvcVersion = a.getPreferredVersion("persistentvolumeclaims"), t.eventsVersion = a.getPreferredVersion("events"), t.isExpansionAllowed = !1;
var i = e("storageClass"), s = [], c = function(e) {
t.isExpansionAllowed = (!e || e.allowVolumeExpansion) && "Bound" === t.pvc.status.phase;
}, l = function(e) {
var n = i(t.pvc);
n !== _.get(i, "metadata.name") && r.get(t.storageClassesVersion, n, {}).then(function(a) {
t.isExpansionAllowed = (!a || a.allowVolumeExpansion) && "Bound" === e.status.phase, s.push(r.watchObject(t.storageClassesVersion, n, {
namespace: t.projectContext
}, c));
});
}, u = function(e, n) {
t.pvc = e, t.loaded = !0, l(e), "DELETED" === n && (t.alerts.deleted = {
type: "warning",
message: "This persistent volume claim has been deleted."
});
};
o.get(n.project).then(_.spread(function(a, o) {
t.project = a, t.projectContext = o, r.get(t.pvcVersion, n.pvc, o, {
errorNotification: !1
}).then(function(e) {
u(e), s.push(r.watchObject(t.pvcVersion, n.pvc, o, u));
}, function(n) {
t.loaded = !0, t.alerts.load = {
type: "error",
message: "The persistent volume claim details could not be loaded.",
details: e("getErrorDetails")(n)
};
}), t.$on("$destroy", function() {
r.unwatchAll(s);
});
}));
} ]), angular.module("openshiftConsole").controller("SetLimitsController", [ "$filter", "$location", "$parse", "$routeParams", "$scope", "APIService", "AuthorizationService", "BreadcrumbsService", "DataService", "LimitRangesService", "Navigate", "NotificationsService", "ProjectsService", function(e, t, n, a, r, o, i, s, c, l, u, d, m) {
if (a.kind && a.name) {
var p = [ "Deployment", "DeploymentConfig", "ReplicaSet", "ReplicationController" ];
if (_.includes(p, a.kind)) {
var g = e("humanizeKind"), f = g(a.kind, !0) + " " + a.name;
r.name = a.name, "ReplicationController" !== a.kind && "ReplicaSet" !== a.kind || (r.showPodWarning = !0), r.renderOptions = {
hideFilterWidget: !0
}, r.breadcrumbs = s.getBreadcrumbs({
name: a.name,
kind: a.kind,
namespace: a.project,
subpage: "Edit Resource Limits"
});
var h = e("getErrorDetails"), v = function(e, t) {
d.addNotification({
id: "set-compute-limits-error",
type: "error",
message: e,
details: t
});
}, y = function() {
t.url(r.resourceURL);
}, b = function() {
d.hideNotification("set-compute-limits-error");
};
r.cancel = y, r.$on("$destroy", b);
var S = o.getPreferredVersion("limitranges");
m.get(a.project).then(_.spread(function(e, t) {
r.hideCPU = l.hasClusterResourceOverrides(e);
var n = {
resource: o.kindToResource(a.kind),
group: a.group
};
if (i.canI(n, "update", a.project)) {
c.get(n, r.name, t).then(function(a) {
var o = r.object = angular.copy(a);
r.breadcrumbs = s.getBreadcrumbs({
object: o,
project: e,
subpage: "Edit Resource Limits"
}), r.resourceURL = u.resourceURL(o), r.containers = _.get(o, "spec.template.spec.containers"), r.save = function() {
r.disableInputs = !0, b(), c.update(n, r.name, o, t).then(function() {
d.addNotification({
type: "success",
message: f + " was updated."
}), y();
}, function(e) {
r.disableInputs = !1, v(f + " could not be updated.", h(e));
});
};
}, function(e) {
v(f + " could not be loaded.", h(e));
});
var m = function() {
r.hideCPU || (r.cpuProblems = l.validatePodLimits(r.limitRanges, "cpu", r.containers, e)), r.memoryProblems = l.validatePodLimits(r.limitRanges, "memory", r.containers, e);
};
c.list(S, t).then(function(e) {
r.limitRanges = e.by("metadata.name"), _.isEmpty(r.limitRanges) || r.$watch("containers", m, !0);
});
} else u.toErrorPage("You do not have authority to update " + g(a.kind) + " " + a.name + ".", "access_denied");
}));
} else u.toErrorPage("Health checks are not supported for kind " + a.kind + ".");
} else u.toErrorPage("Kind or name parameter missing.");
} ]), angular.module("openshiftConsole").controller("EditBuildConfigController", [ "$scope", "$filter", "$location", "$routeParams", "$window", "APIService", "AuthorizationService", "DataService", "Navigate", "NotificationsService", "ProjectsService", "SOURCE_URL_PATTERN", "SecretsService", "keyValueEditorUtils", function(e, t, n, a, r, o, i, s, c, l, u, d, m, p) {
e.projectName = a.project, e.buildConfig = null, e.alerts = {}, e.sourceURLPattern = d, e.options = {}, e.jenkinsfileOptions = {
type: "path"
}, e.selectTypes = {
ImageStreamTag: "Image Stream Tag",
ImageStreamImage: "Image Stream Image",
DockerImage: "Docker Image Repository"
}, e.buildFromTypes = [ "ImageStreamTag", "ImageStreamImage", "DockerImage" ], e.pushToTypes = [ "ImageStreamTag", "DockerImage", "None" ], e.jenkinsfileTypes = [ {
id: "path",
title: "From Source Repository"
}, {
id: "inline",
title: "Inline"
} ], e.view = {
advancedOptions: !1,
hasHooks: !1
}, e.breadcrumbs = [], a.isPipeline ? (e.breadcrumbs.push({
title: "Pipelines",
link: "project/" + a.project + "/browse/pipelines"
}), e.breadcrumbs.push({
title: a.buildconfig,
link: "project/" + a.project + "/browse/pipelines/" + a.buildconfig
})) : (e.breadcrumbs.push({
title: "Builds",
link: "project/" + a.project + "/browse/builds"
}), e.breadcrumbs.push({
title: a.buildconfig,
link: "project/" + a.project + "/browse/builds/" + a.buildconfig
})), e.breadcrumbs.push({
title: a.isPipeline ? "Edit Pipelines" : "Edit Builds"
}), e.imageOptions = {
from: {},
to: {},
fromSource: {}
}, e.sources = {
binary: !1,
dockerfile: !1,
git: !1,
images: !1,
contextDir: !1,
none: !0
}, e.triggers = {
webhookTriggers: [],
imageChangeTriggers: [],
builderImageChangeTrigger: {},
configChangeTrigger: {}
}, e.runPolicyTypes = [ "Serial", "Parallel", "SerialLatestOnly" ], e.buildHookTypes = [ {
id: "command",
label: "Command"
}, {
id: "script",
label: "Shell Script"
}, {
id: "args",
label: "Arguments to default image entry point"
}, {
id: "commandArgs",
label: "Command with arguments"
}, {
id: "scriptArgs",
label: "Shell script with arguments"
} ], e.buildHookSelection = {
type: {}
}, e.getArgumentsDescription = function() {
switch (_.get(e, "buildHookSelection.type.id", "")) {
case "args":
return "Enter the arguments that will be appended to the default image entry point.";

case "commandArgs":
return "Enter the arguments that will be appended to the command.";

case "scriptArgs":
return "Enter the arguments that will be appended to the script.";
}
return null;
};
var g = function() {
var t = !_.isEmpty(_.get(e, "buildConfig.spec.postCommit.args")), n = !_.isEmpty(_.get(e, "buildConfig.spec.postCommit.command")), a = !!_.get(e, "buildConfig.spec.postCommit.script");
e.view.hasHooks = t || n || a;
var r;
r = t && n ? "commandArgs" : t && a ? "scriptArgs" : t ? "args" : a ? "script" : "command", e.buildHookSelection.type = _.find(e.buildHookTypes, {
id: r
});
}, f = function() {
if (e.view.hasHooks) switch (e.buildHookSelection.type.id) {
case "script":
delete e.updatedBuildConfig.spec.postCommit.command, delete e.updatedBuildConfig.spec.postCommit.args;
break;

case "command":
delete e.updatedBuildConfig.spec.postCommit.script, delete e.updatedBuildConfig.spec.postCommit.args;
break;

case "args":
delete e.updatedBuildConfig.spec.postCommit.script, delete e.updatedBuildConfig.spec.postCommit.command;
break;

case "scriptArgs":
delete e.updatedBuildConfig.spec.postCommit.command;
break;

case "commandArgs":
delete e.updatedBuildConfig.spec.postCommit.script;
} else delete e.updatedBuildConfig.spec.postCommit.command, delete e.updatedBuildConfig.spec.postCommit.args, delete e.updatedBuildConfig.spec.postCommit.script;
};
e.secrets = {};
var h = o.getPreferredVersion("buildconfigs"), v = o.getPreferredVersion("secrets"), y = [], b = t("buildStrategy"), S = t("orderByDisplayName"), C = t("getErrorDetails"), w = [], P = [];
e.valueFromObjects = [];
var k = function() {
var t;
e.buildConfig ? (t = c.resourceURL(e.buildConfig), n.path(t)) : r.history.back();
};
e.cancel = k;
var j = function() {
l.hideNotification("edit-build-config-error"), l.hideNotification("edit-build-config-conflict"), l.hideNotification("edit-build-config-deleted");
};
e.$on("$destroy", j), u.get(a.project).then(_.spread(function(n, r) {
e.project = n, e.context = r, i.canI("buildconfigs", "update", a.project) ? (s.get(h, a.buildconfig, r, {
errorNotification: !1
}).then(function(t) {
e.buildConfig = t, g(), e.updatedBuildConfig = angular.copy(e.buildConfig), e.buildStrategy = b(e.updatedBuildConfig), e.strategyType = e.buildConfig.spec.strategy.type, e.envVars = e.buildStrategy.env || [], e.triggers = R(e.triggers, e.buildConfig.spec.triggers), e.sources = B(e.sources, e.buildConfig.spec.source), _.has(t, "spec.strategy.jenkinsPipelineStrategy.jenkinsfile") && (e.jenkinsfileOptions.type = "inline"), i.canI(v, "list", a.project) && s.list(v, r).then(function(t) {
var n = m.groupSecretsByType(t), a = _.mapValues(n, function(e) {
return _.map(e, "metadata.name");
});
e.webhookSecrets = m.groupSecretsByType(t).webhook, e.webhookSecrets.unshift(""), e.secrets.secretsByType = _.each(a, function(e) {
e.unshift("");
}), E(), P = S(t.by("metadata.name")), e.valueFromObjects = w.concat(P);
});
var n = function(e, n) {
e.type = n && n.kind ? n.kind : "None";
var a = {}, r = "", o = "";
a = "ImageStreamTag" === e.type ? {
namespace: n.namespace || t.metadata.namespace,
imageStream: n.name.split(":")[0],
tagObject: {
tag: n.name.split(":")[1]
}
} : {
namespace: "",
imageStream: "",
tagObject: {
tag: ""
}
}, r = "ImageStreamImage" === e.type ? (n.namespace || t.metadata.namespace) + "/" + n.name : "", o = "DockerImage" === e.type ? n.name : "", e.imageStreamTag = a, e.imageStreamImage = r, e.dockerImage = o;
};
n(e.imageOptions.from, e.buildStrategy.from), n(e.imageOptions.to, e.updatedBuildConfig.spec.output.to), e.sources.images && (e.sourceImages = e.buildConfig.spec.source.images, 1 === _.size(e.sourceImages) ? (e.imageSourceTypes = angular.copy(e.buildFromTypes), n(e.imageOptions.fromSource, e.sourceImages[0].from), e.imageSourcePaths = _.map(e.sourceImages[0].paths, function(e) {
return {
name: e.sourcePath,
value: e.destinationDir
};
})) : (e.imageSourceFromObjects = [], e.sourceImages.forEach(function(t) {
e.imageSourceFromObjects.push(t.from);
}))), e.options.forcePull = !!e.buildStrategy.forcePull, "Docker" === e.strategyType && (e.options.noCache = !!e.buildConfig.spec.strategy.dockerStrategy.noCache, e.buildFromTypes.push("None")), y.push(s.watchObject(h, a.buildconfig, r, function(t, n) {
"MODIFIED" === n && l.addNotification({
id: "edit-build-config-conflict",
type: "warning",
message: "This build configuration has changed since you started editing it. You'll need to copy any changes you've made and edit again."
}), "DELETED" === n && (l.addNotification({
id: "edit-build-config-deleted",
type: "warning",
message: "This build configuration has been deleted."
}), e.disableInputs = !0), e.buildConfig = t;
})), e.loaded = !0;
}, function(n) {
e.loaded = !0, e.alerts.load = {
type: "error",
message: "The build configuration details could not be loaded.",
details: "Reason: " + t("getErrorDetails")(n)
};
}), s.list("configmaps", r, null, {
errorNotification: !1
}).then(function(t) {
w = S(t.by("metadata.name")), e.valueFromObjects = w.concat(P);
}, function(e) {
403 !== e.code && l.addNotification({
id: "edit-build-config-list-config-maps-error",
type: "error",
message: "Could not load config maps.",
details: C(e)
});
})) : c.toErrorPage("You do not have authority to update build config " + a.buildconfig + ".", "access_denied");
}));
var R = function(n, a) {
function r(n, a) {
return t("imageObjectRef")(n, e.projectName) === t("imageObjectRef")(a, e.projectName);
}
var o = b(e.buildConfig).from;
return a.forEach(function(e) {
switch (e.type) {
case "Generic":
case "GitHub":
case "GitLab":
case "Bitbucket":
n.webhookTriggers.push({
lastTriggerType: e.type,
data: e
});
break;

case "ImageChange":
var t = e.imageChange.from;
t || (t = o);
var a = {
present: !0,
data: e
};
r(t, o) ? n.builderImageChangeTrigger = a : n.imageChangeTriggers.push(a);
break;

case "ConfigChange":
n.configChangeTrigger = {
present: !0,
data: e
};
}
}), _.isEmpty(n.builderImageChangeTrigger) && (n.builderImageChangeTrigger = {
present: !1,
data: {
imageChange: {},
type: "ImageChange"
}
}), _.isEmpty(n.configChangeTrigger) && (n.configChangeTrigger = {
present: !1,
data: {
type: "ConfigChange"
}
}), n;
};
e.aceLoaded = function(e) {
var t = e.getSession();
t.setOption("tabSize", 2), t.setOption("useSoftTabs", !0), e.$blockScrolling = 1 / 0;
};
var I = function(e) {
return _.map(p.compactEntries(e), function(e) {
return {
sourcePath: e.name,
destinationDir: e.value
};
});
}, T = function(t) {
var n = {};
switch (t.type) {
case "ImageStreamTag":
n = {
kind: t.type,
name: t.imageStreamTag.imageStream + ":" + t.imageStreamTag.tagObject.tag
}, t.imageStreamTag.namespace !== e.buildConfig.metadata.namespace && (n.namespace = t.imageStreamTag.namespace);
break;

case "DockerImage":
n = {
kind: t.type,
name: t.dockerImage
};
break;

case "ImageStreamImage":
var a = t.imageStreamImage.split("/");
(n = {
kind: t.type,
name: _.last(a)
}).namespace = 1 !== _.size(a) ? _.head(a) : e.buildConfig.metadata.namespace;
}
return n;
}, N = function(e) {
return _.filter(e, function(e) {
return !_.isEmpty(e.data.type) && !_.isEmpty(e.data[_.toLower(e.data.type)]);
});
}, A = function() {
var t = [].concat(e.triggers.imageChangeTriggers, e.triggers.builderImageChangeTrigger, e.triggers.configChangeTrigger);
return t = _.filter(t, function(e) {
return _.has(e, "disabled") && !e.disabled || e.present;
}), t = t.concat(N(e.triggers.webhookTriggers)), t = _.map(t, "data");
}, E = function() {
switch (e.secrets.picked = {
gitSecret: e.buildConfig.spec.source.sourceSecret ? [ e.buildConfig.spec.source.sourceSecret ] : [ {
name: ""
} ],
pullSecret: b(e.buildConfig).pullSecret ? [ b(e.buildConfig).pullSecret ] : [ {
name: ""
} ],
pushSecret: e.buildConfig.spec.output.pushSecret ? [ e.buildConfig.spec.output.pushSecret ] : [ {
name: ""
} ]
}, e.strategyType) {
case "Source":
case "Docker":
e.secrets.picked.sourceSecrets = e.buildConfig.spec.source.secrets || [ {
secret: {
name: ""
},
destinationDir: ""
} ];
break;

case "Custom":
e.secrets.picked.sourceSecrets = b(e.buildConfig).secrets || [ {
secretSource: {
name: ""
},
mountPath: ""
} ];
}
}, D = function(e, t, n) {
t.name ? e[n] = t : delete e[n];
}, $ = function(t, n) {
var a = "Custom" === e.strategyType ? "secretSource" : "secret", r = _.filter(n, function(e) {
return e[a].name;
});
_.isEmpty(r) ? delete t.secrets : t.secrets = r;
}, B = function(e, t) {
return "None" === t.type ? e : (e.none = !1, angular.forEach(t, function(t, n) {
e[n] = !0;
}), e);
};
e.save = function() {
switch (e.disableInputs = !0, f(), b(e.updatedBuildConfig).forcePull = e.options.forcePull, e.strategyType) {
case "Docker":
b(e.updatedBuildConfig).noCache = e.options.noCache;
break;

case "JenkinsPipeline":
"path" === e.jenkinsfileOptions.type ? delete e.updatedBuildConfig.spec.strategy.jenkinsPipelineStrategy.jenkinsfile : delete e.updatedBuildConfig.spec.strategy.jenkinsPipelineStrategy.jenkinsfilePath;
}
switch (e.sources.images && !_.isEmpty(e.sourceImages) && (e.updatedBuildConfig.spec.source.images[0].paths = I(e.imageSourcePaths), e.updatedBuildConfig.spec.source.images[0].from = T(e.imageOptions.fromSource)), "None" === e.imageOptions.from.type ? delete b(e.updatedBuildConfig).from : b(e.updatedBuildConfig).from = T(e.imageOptions.from), "None" === e.imageOptions.to.type ? delete e.updatedBuildConfig.spec.output.to : e.updatedBuildConfig.spec.output.to = T(e.imageOptions.to), b(e.updatedBuildConfig).env = p.compactEntries(e.envVars), D(e.updatedBuildConfig.spec.source, _.head(e.secrets.picked.gitSecret), "sourceSecret"), D(b(e.updatedBuildConfig), _.head(e.secrets.picked.pullSecret), "pullSecret"), D(e.updatedBuildConfig.spec.output, _.head(e.secrets.picked.pushSecret), "pushSecret"), e.strategyType) {
case "Source":
case "Docker":
$(e.updatedBuildConfig.spec.source, e.secrets.picked.sourceSecrets);
break;

case "Custom":
$(b(e.updatedBuildConfig), e.secrets.picked.sourceSecrets);
}
e.updatedBuildConfig.spec.triggers = A(), j(), s.update(h, e.updatedBuildConfig.metadata.name, e.updatedBuildConfig, e.context).then(function() {
l.addNotification({
type: "success",
message: "Build config " + e.updatedBuildConfig.metadata.name + " was successfully updated."
}), k();
}, function(n) {
e.disableInputs = !1, l.addNotification({
id: "edit-build-config-error",
type: "error",
message: "An error occurred updating build config " + e.updatedBuildConfig.metadata.name + ".",
details: t("getErrorDetails")(n)
});
});
}, e.$on("$destroy", function() {
s.unwatchAll(y);
});
} ]), angular.module("openshiftConsole").controller("EditConfigMapController", [ "$filter", "$routeParams", "$scope", "$window", "APIService", "DataService", "BreadcrumbsService", "Navigate", "NotificationsService", "ProjectsService", function(e, t, n, a, r, o, i, s, c, l) {
var u = [];
n.forms = {}, n.projectName = t.project, n.breadcrumbs = i.getBreadcrumbs({
name: t.configMap,
kind: "ConfigMap",
namespace: t.project,
subpage: "Edit Config Map"
});
var d = function(e) {
return _.get(e, "metadata.resourceVersion");
}, m = function() {
c.hideNotification("edit-config-map-error");
}, p = function() {
a.history.back();
};
n.cancel = p;
var g = r.getPreferredVersion("configmaps");
l.get(t.project).then(_.spread(function(a, r) {
o.get(g, t.configMap, r, {
errorNotification: !1
}).then(function(e) {
n.loaded = !0, n.breadcrumbs = i.getBreadcrumbs({
name: t.configMap,
object: e,
project: a,
subpage: "Edit Config Map"
}), n.configMap = e, u.push(o.watchObject(g, t.configMap, r, function(e, t) {
n.resourceChanged = d(e) !== d(n.configMap), n.resourceDeleted = "DELETED" === t;
}));
}, function(n) {
s.toErrorPage("Could not load config map " + t.configMap + ". " + e("getErrorDetails")(n));
}), n.updateConfigMap = function() {
n.forms.editConfigMapForm.$valid && (m(), n.disableInputs = !0, o.update(g, n.configMap.metadata.name, n.configMap, r).then(function() {
c.addNotification({
type: "success",
message: "Config map " + n.configMap.metadata.name + " successfully updated."
}), p();
}, function(t) {
n.disableInputs = !1, c.addNotification({
id: "edit-config-map-error",
type: "error",
message: "An error occurred updating the config map.",
details: e("getErrorDetails")(t)
});
}));
}, n.$on("$destroy", function() {
o.unwatchAll(u), m();
});
}));
} ]), angular.module("openshiftConsole").controller("EditDeploymentConfigController", [ "$scope", "$filter", "$location", "$routeParams", "$uibModal", "$window", "APIService", "AuthorizationService", "BreadcrumbsService", "DataService", "EnvironmentService", "Navigate", "NotificationsService", "ProjectsService", "SecretsService", "keyValueEditorUtils", function(e, t, n, a, r, o, i, s, c, l, u, d, m, p, g, f) {
e.projectName = a.project, e.deploymentConfig = null, e.alerts = {}, e.view = {
advancedStrategyOptions: !1,
advancedImageOptions: !1
}, e.triggers = {}, e.breadcrumbs = c.getBreadcrumbs({
name: a.name,
kind: a.kind,
namespace: a.project,
subpage: "Edit Deployment Config"
}), e.deploymentConfigStrategyTypes = [ "Recreate", "Rolling", "Custom" ];
var h = t("orderByDisplayName"), v = t("getErrorDetails"), y = function(t, n) {
e.alerts["from-value-objects"] = {
type: "error",
message: t,
details: n
};
}, b = i.getPreferredVersion("deploymentconfigs"), S = i.getPreferredVersion("configmaps"), C = i.getPreferredVersion("secrets"), w = [], P = [], k = [];
e.valueFromObjects = [];
var j = function(e) {
switch (e) {
case "Recreate":
return "recreateParams";

case "Rolling":
return "rollingParams";

case "Custom":
return "customParams";

default:
return void Logger.error("Unknown deployment strategy type: " + e);
}
};
p.get(a.project).then(_.spread(function(n, r) {
e.project = n, e.context = r, s.canI("deploymentconfigs", "update", a.project) ? l.get(b, a.deploymentconfig, r, {
errorNotification: !1
}).then(function(t) {
e.deploymentConfig = t, e.breadcrumbs = c.getBreadcrumbs({
object: t,
project: n,
subpage: "Edit"
});
e.updatedDeploymentConfig = angular.copy(e.deploymentConfig), e.containerNames = _.map(e.deploymentConfig.spec.template.spec.containers, "name"), e.containerConfigByName = function(t, n) {
var a = {}, r = _.filter(n, {
type: "ImageChange"
});
return _.each(t, function(t) {
var n = _.find(r, function(e) {
return _.includes(e.imageChangeParams.containerNames, t.name);
}), o = {};
if (t.env = t.env || [], a[t.name] = {
env: t.env,
image: t.image,
hasDeploymentTrigger: !_.isEmpty(n)
}, n) {
var i = n.imageChangeParams.from, s = i.name.split(":");
o = {
data: n,
istag: {
namespace: i.namespace || e.projectName,
imageStream: s[0],
tagObject: {
tag: s[1]
}
},
automatic: _.get(n, "imageChangeParams.automatic", !1)
};
} else o = {
istag: {
namespace: "",
imageStream: ""
},
automatic: !0
};
_.set(a, [ t.name, "triggerData" ], o);
}), a;
}(e.updatedDeploymentConfig.spec.template.spec.containers, e.updatedDeploymentConfig.spec.triggers), e.secrets = {
pullSecrets: angular.copy(e.deploymentConfig.spec.template.spec.imagePullSecrets) || [ {
name: ""
} ]
}, e.volumeNames = _.map(e.deploymentConfig.spec.template.spec.volumes, "name"), e.strategyData = angular.copy(e.deploymentConfig.spec.strategy), e.originalStrategy = e.strategyData.type, e.strategyParamsPropertyName = j(e.strategyData.type), e.triggers.hasConfigTrigger = _.some(e.updatedDeploymentConfig.spec.triggers, {
type: "ConfigChange"
}), "Custom" !== e.strategyData.type || _.has(e.strategyData, "customParams.environment") || (e.strategyData.customParams.environment = []), l.list(S, r, null, {
errorNotification: !1
}).then(function(t) {
P = h(t.by("metadata.name")), e.availableConfigMaps = P, e.valueFromObjects = P.concat(k);
}, function(e) {
403 !== e.status && y("Could not load config maps", v(e));
}), l.list(C, r, null, {
errorNotification: !1
}).then(function(t) {
k = h(t.by("metadata.name")), e.availableSecrets = k, e.valueFromObjects = P.concat(k);
var n = g.groupSecretsByType(t), a = _.mapValues(n, function(e) {
return _.map(e, "metadata.name");
});
e.secretsByType = _.each(a, function(e) {
e.unshift("");
});
}, function(e) {
403 !== e.status && y("Could not load secrets", v(e));
}), w.push(l.watchObject(b, a.deploymentconfig, r, function(t, n) {
"MODIFIED" === n && (e.alerts["updated/deleted"] = {
type: "warning",
message: "This deployment configuration has changed since you started editing it. You'll need to copy any changes you've made and edit again."
}), "DELETED" === n && (e.alerts["updated/deleted"] = {
type: "warning",
message: "This deployment configuration has been deleted."
}, e.disableInputs = !0), e.deploymentConfig = t;
})), e.loaded = !0;
}, function(n) {
e.loaded = !0, e.alerts.load = {
type: "error",
message: "The deployment configuration details could not be loaded.",
details: t("getErrorDetails")(n)
};
}) : d.toErrorPage("You do not have authority to update deployment config " + a.deploymentconfig + ".", "access_denied");
}));
var R = function() {
return "Custom" !== e.strategyData.type && "Custom" !== e.originalStrategy && e.strategyData.type !== e.originalStrategy;
}, I = function(t) {
_.has(e.strategyData, t) || r.open({
templateUrl: "views/modals/confirm.html",
controller: "ConfirmModalController",
resolve: {
modalConfig: function() {
return {
alerts: e.alerts,
title: "Keep some existing " + e.originalStrategy.toLowerCase() + " strategy parameters?",
details: "The timeout parameter and any pre or post lifecycle hooks will be copied from " + e.originalStrategy.toLowerCase() + " strategy to " + e.strategyData.type.toLowerCase() + " strategy. After saving the changes, " + e.originalStrategy.toLowerCase() + " strategy parameters will be removed.",
okButtonText: "Yes",
okButtonClass: "btn-primary",
cancelButtonText: "No"
};
}
}
}).result.then(function() {
e.strategyData[t] = angular.copy(e.strategyData[j(e.originalStrategy)]);
}, function() {
e.strategyData[t] = {};
});
};
e.strategyChanged = function() {
var t = j(e.strategyData.type);
R() ? I(t) : _.has(e.strategyData, t) || ("Custom" !== e.strategyData.type ? e.strategyData[t] = {} : e.strategyData[t] = {
image: "",
command: [],
environment: []
}), e.strategyParamsPropertyName = t;
};
var T = function(e, t, n, a) {
var r = {
kind: "ImageStreamTag",
namespace: t.namespace,
name: t.imageStream + ":" + t.tagObject.tag
};
return n ? (n.imageChangeParams.from = r, n.imageChangeParams.automatic = a) : n = {
type: "ImageChange",
imageChangeParams: {
automatic: a,
containerNames: [ e ],
from: r
}
}, n;
}, N = function() {
var t = _.reject(e.updatedDeploymentConfig.spec.triggers, function(e) {
return "ImageChange" === e.type || "ConfigChange" === e.type;
});
return _.each(e.containerConfigByName, function(n, a) {
n.hasDeploymentTrigger ? t.push(T(a, n.triggerData.istag, n.triggerData.data, n.triggerData.automatic)) : _.find(e.updatedDeploymentConfig.spec.template.spec.containers, {
name: a
}).image = n.image;
}), e.triggers.hasConfigTrigger && t.push({
type: "ConfigChange"
}), t;
}, A = function() {
m.hideNotification("edit-deployment-config-error");
};
e.save = function() {
if (e.disableInputs = !0, _.each(e.containerConfigByName, function(t, n) {
_.find(e.updatedDeploymentConfig.spec.template.spec.containers, {
name: n
}).env = f.compactEntries(t.env);
}), R() && delete e.strategyData[j(e.originalStrategy)], "Rolling" === e.strategyData.type) {
var a = e.strategyData[e.strategyParamsPropertyName].maxSurge, r = Number(a);
"" === a ? e.strategyData[e.strategyParamsPropertyName].maxSurge = null : _.isFinite(r) && (e.strategyData[e.strategyParamsPropertyName].maxSurge = r);
var o = e.strategyData[e.strategyParamsPropertyName].maxUnavailable, i = Number(o);
"" === o ? e.strategyData[e.strategyParamsPropertyName].maxUnavailable = null : _.isFinite(i) && (e.strategyData[e.strategyParamsPropertyName].maxUnavailable = i);
}
"Custom" !== e.strategyData.type && _.each([ "pre", "mid", "post" ], function(t) {
_.has(e.strategyData, [ e.strategyParamsPropertyName, t, "execNewPod", "env" ]) && (e.strategyData[e.strategyParamsPropertyName][t].execNewPod.env = f.compactEntries(e.strategyData[e.strategyParamsPropertyName][t].execNewPod.env));
}), _.has(e, "strategyData.customParams.environment") && (e.strategyData.customParams.environment = f.compactEntries(e.strategyData.customParams.environment)), e.updatedDeploymentConfig.spec.template.spec.imagePullSecrets = _.filter(e.secrets.pullSecrets, "name"), e.updatedDeploymentConfig.spec.strategy = e.strategyData, e.updatedDeploymentConfig.spec.triggers = N(), A(), l.update(b, e.updatedDeploymentConfig.metadata.name, e.updatedDeploymentConfig, e.context).then(function() {
m.addNotification({
type: "success",
message: "Deployment config " + e.updatedDeploymentConfig.metadata.name + " was successfully updated."
});
var t = d.resourceURL(e.updatedDeploymentConfig);
n.url(t);
}, function(n) {
e.disableInputs = !1, m.addNotification({
id: "edit-deployment-config-error",
type: "error",
message: "An error occurred updating deployment config " + e.updatedDeploymentConfig.metadata.name + ".",
details: t("getErrorDetails")(n)
});
});
}, e.cancel = function() {
o.history.back();
}, e.$on("$destroy", function() {
l.unwatchAll(w), A();
});
} ]), angular.module("openshiftConsole").controller("EditAutoscalerController", [ "$scope", "$filter", "$routeParams", "$window", "APIService", "AuthorizationService", "BreadcrumbsService", "DataService", "HPAService", "MetricsService", "Navigate", "NotificationsService", "ProjectsService", "keyValueEditorUtils", function(e, t, n, a, r, o, i, s, c, l, u, d, m, p) {
if (n.kind && n.name) {
var g = [ "Deployment", "DeploymentConfig", "HorizontalPodAutoscaler", "ReplicaSet", "ReplicationController" ];
if (_.includes(g, n.kind)) {
e.kind = n.kind, e.name = n.name, "HorizontalPodAutoscaler" === n.kind ? e.disableInputs = !0 : (e.targetKind = n.kind, e.targetName = n.name), e.autoscaling = {
name: e.name
}, e.labels = [], l.isAvailable().then(function(t) {
e.metricsWarning = !t;
});
var f = t("getErrorDetails"), h = function() {
a.history.back();
};
e.cancel = h;
var v = function() {
d.hideNotification("edit-hpa-error");
};
e.$on("$destroy", v);
var y = r.getPreferredVersion("horizontalpodautoscalers"), b = r.getPreferredVersion("limitranges");
m.get(n.project).then(_.spread(function(t, a) {
e.project = t;
var l = "HorizontalPodAutoscaler" === n.kind ? "update" : "create";
if (o.canI({
resource: "horizontalpodautoscalers",
group: "autoscaling"
}, l, n.project)) {
var m = function(t) {
e.disableInputs = !0, (t = angular.copy(t)).metadata.labels = p.mapEntries(p.compactEntries(e.labels)), t.spec.minReplicas = e.autoscaling.minReplicas, t.spec.maxReplicas = e.autoscaling.maxReplicas, t.spec.targetCPUUtilizationPercentage = e.autoscaling.targetCPU, s.update(y, t.metadata.name, t, a).then(function(e) {
d.addNotification({
type: "success",
message: "Horizontal pod autoscaler " + e.metadata.name + " successfully updated."
}), h();
}, function(t) {
e.disableInputs = !1, d.addNotification({
id: "edit-hpa-error",
type: "error",
message: "An error occurred creating the horizontal pod autoscaler.",
details: f(t)
});
});
}, g = {};
g = "HorizontalPodAutoscaler" === n.kind ? {
resource: "horizontalpodautoscalers",
group: "autoscaling",
version: "v1"
} : {
resource: r.kindToResource(n.kind),
group: n.group
}, s.get(g, n.name, a).then(function(r) {
if (e.labels = _.map(_.get(r, "metadata.labels", {}), function(e, t) {
return {
name: t,
value: e
};
}), e.usesV2Metrics = c.usesV2Metrics(r), "HorizontalPodAutoscaler" === n.kind) e.targetKind = _.get(r, "spec.scaleTargetRef.kind"), e.targetName = _.get(r, "spec.scaleTargetRef.name"), _.assign(e.autoscaling, {
minReplicas: _.get(r, "spec.minReplicas"),
maxReplicas: _.get(r, "spec.maxReplicas"),
targetCPU: _.get(r, "spec.targetCPUUtilizationPercentage")
}), e.disableInputs = !1, e.save = function() {
m(r);
}, e.breadcrumbs = i.getBreadcrumbs({
name: e.targetName,
kind: e.targetKind,
namespace: n.project,
project: t,
subpage: "Autoscale"
}); else {
e.breadcrumbs = i.getBreadcrumbs({
object: r,
project: t,
subpage: "Autoscale"
}), e.save = function() {
e.disableInputs = !0, v();
var t = {
apiVersion: "autoscaling/v1",
kind: "HorizontalPodAutoscaler",
metadata: {
name: e.autoscaling.name,
labels: p.mapEntries(p.compactEntries(e.labels))
},
spec: {
scaleTargetRef: {
kind: r.kind,
name: r.metadata.name,
apiVersion: r.apiVersion
},
minReplicas: e.autoscaling.minReplicas,
maxReplicas: e.autoscaling.maxReplicas,
targetCPUUtilizationPercentage: e.autoscaling.targetCPU
}
};
s.create(y, null, t, a).then(function(e) {
d.addNotification({
type: "success",
message: "Horizontal pod autoscaler " + e.metadata.name + " successfully created."
}), h();
}, function(t) {
e.disableInputs = !1, d.addNotification({
id: "edit-hpa-error",
type: "error",
message: "An error occurred creating the horizontal pod autoscaler.",
details: f(t)
});
});
};
var o = {}, l = function() {
var n = _.get(r, "spec.template.spec.containers", []);
e.showCPURequestWarning = !c.hasCPURequest(n, o, t);
};
s.list(b, a).then(function(e) {
o = e.by("metadata.name"), l();
});
}
});
} else u.toErrorPage("You do not have authority to " + l + " horizontal pod autoscalers in project " + n.project + ".", "access_denied");
}));
} else u.toErrorPage("Autoscaling not supported for kind " + n.kind + ".");
} else u.toErrorPage("Kind or name parameter missing.");
} ]), angular.module("openshiftConsole").controller("EditHealthChecksController", [ "$filter", "$location", "$routeParams", "$scope", "AuthorizationService", "BreadcrumbsService", "APIService", "DataService", "Navigate", "NotificationsService", "ProjectsService", function(e, t, n, a, r, o, i, s, c, l, u) {
if (n.kind && n.name) {
var d = [ "Deployment", "DeploymentConfig", "ReplicaSet", "ReplicationController" ];
if (_.includes(d, n.kind)) {
a.name = n.name, a.resourceURL = c.resourceURL(a.name, n.kind, n.project), a.breadcrumbs = o.getBreadcrumbs({
name: n.name,
kind: n.kind,
namespace: n.project,
subpage: "Edit Health Checks"
}), a.previousProbes = {};
var m = e("getErrorDetails"), p = e("upperFirst"), g = function(e, t) {
l.addNotification({
id: "add-health-check-error",
type: "error",
message: e,
details: t
});
}, f = function() {
t.url(a.resourceURL);
};
a.cancel = f;
var h = function() {
l.hideNotification("add-health-check-error");
};
a.$on("$destroy", h), u.get(n.project).then(_.spread(function(t, u) {
var d = e("humanizeKind")(n.kind) + ' "' + a.name + '"', v = {
resource: i.kindToResource(n.kind),
group: n.group
};
r.canI(v, "update", n.project) ? s.get(v, a.name, u).then(function(e) {
var r = a.object = angular.copy(e);
a.breadcrumbs = o.getBreadcrumbs({
object: r,
project: t,
subpage: "Edit Health Checks"
}), a.containers = _.get(r, "spec.template.spec.containers"), a.addProbe = function(e, t) {
e[t] = _.get(a.previousProbes, [ e.name, t ], {}), a.form.$setDirty();
}, a.removeProbe = function(e, t) {
_.set(a.previousProbes, [ e.name, t ], e[t]), delete e[t], a.form.$setDirty();
}, a.save = function() {
a.disableInputs = !0, h(), s.update(i.kindToResource(n.kind), a.name, r, u).then(function() {
l.addNotification({
type: "success",
message: p(d) + " was updated."
}), f();
}, function(e) {
a.disableInputs = !1, g(p(d) + " could not be updated.", m(e));
});
};
}, function(e) {
g(p(d) + " could not be loaded.", m(e));
}) : c.toErrorPage("You do not have authority to update " + d + ".", "access_denied");
}));
} else c.toErrorPage("Health checks are not supported for kind " + n.kind + ".");
} else c.toErrorPage("Kind or name parameter missing.");
} ]), angular.module("openshiftConsole").controller("EditRouteController", [ "$filter", "$location", "$routeParams", "$scope", "APIService", "AuthorizationService", "DataService", "Navigate", "NotificationsService", "ProjectsService", "RoutesService", function(e, t, n, a, r, o, i, s, c, l, u) {
a.renderOptions = {
hideFilterWidget: !0
}, a.projectName = n.project, a.routeName = n.route, a.loading = !0, a.routeURL = s.resourceURL(a.routeName, "Route", a.projectName), a.breadcrumbs = [ {
title: "Routes",
link: "project/" + a.projectName + "/browse/routes"
}, {
title: a.routeName,
link: a.routeURL
}, {
title: "Edit"
} ];
var d = function() {
c.hideNotification("edit-route-error");
};
a.$on("$destroy", d);
var m = function() {
t.path(a.routeURL);
};
a.cancel = m;
var p, g = r.getPreferredVersion("routes"), f = r.getPreferredVersion("services");
l.get(n.project).then(_.spread(function(t, r) {
if (a.project = t, o.canI("routes", "update", n.project)) {
var l, h = e("orderByDisplayName"), v = function() {
s.toErrorPage('Editing routes with non-service targets is unsupported. You can edit the route with the "Edit YAML" action instead.');
};
i.get(g, a.routeName, r).then(function(e) {
"Service" === e.spec.to.kind ? (l = angular.copy(e), p = _.get(l, "spec.host"), "Subdomain" === _.get(l, "spec.wildcardPolicy") && (p = "*." + u.getSubdomain(l)), a.routing = {
host: p,
wildcardPolicy: _.get(l, "spec.wildcardPolicy"),
path: _.get(l, "spec.path"),
targetPort: _.get(l, "spec.port.targetPort"),
tls: angular.copy(_.get(l, "spec.tls"))
}, i.list(f, r).then(function(e) {
a.loading = !1;
var t = e.by("metadata.name");
a.routing.to = l.spec.to, a.routing.alternateServices = [], _.each(_.get(l, "spec.alternateBackends"), function(e) {
if ("Service" !== e.kind) return v(), !1;
a.routing.alternateServices.push(e);
}), a.services = h(t);
})) : v();
}, function() {
s.toErrorPage("Could not load route " + a.routeName + ".");
});
var y = function() {
var e = angular.copy(l), t = _.get(a, "routing.to.name");
_.set(e, "spec.to.name", t);
var n = _.get(a, "routing.to.weight");
isNaN(n) || _.set(e, "spec.to.weight", n);
var r = a.routing.host;
p !== r && (r.startsWith("*.") && (r = "wildcard" + r.substring(1)), e.spec.host = r), e.spec.path = a.routing.path;
var o = a.routing.targetPort;
o ? _.set(e, "spec.port.targetPort", o) : delete e.spec.port, _.get(a, "routing.tls.termination") ? (e.spec.tls = a.routing.tls, "passthrough" === e.spec.tls.termination && (delete e.spec.path, delete e.spec.tls.certificate, delete e.spec.tls.key, delete e.spec.tls.caCertificate), "reencrypt" !== e.spec.tls.termination && delete e.spec.tls.destinationCACertificate) : delete e.spec.tls;
var i = _.get(a, "routing.alternateServices", []);
return _.isEmpty(i) ? delete e.spec.alternateBackends : e.spec.alternateBackends = _.map(i, function(e) {
return {
kind: "Service",
name: e.name,
weight: e.weight
};
}), e;
};
a.updateRoute = function() {
if (a.form.$valid) {
d(), a.disableInputs = !0;
var t = y();
i.update(g, a.routeName, t, r).then(function() {
c.addNotification({
type: "success",
message: "Route " + a.routeName + " was successfully updated."
}), m();
}, function(t) {
a.disableInputs = !1, c.addNotification({
type: "error",
id: "edit-route-error",
message: "An error occurred updating route " + a.routeName + ".",
details: e("getErrorDetails")(t)
});
});
}
};
} else s.toErrorPage("You do not have authority to update route " + n.routeName + ".", "access_denied");
}));
} ]), angular.module("openshiftConsole").controller("EditYAMLController", [ "$scope", "$filter", "$location", "$routeParams", "$window", "APIService", "AuthorizationService", "BreadcrumbsService", "DataService", "Navigate", "NotificationsService", "ProjectsService", function(e, t, n, a, r, o, i, s, c, l, u, d) {
if (a.kind && a.name) {
var m = t("humanizeKind");
e.alerts = {}, e.name = a.name, e.resourceURL = l.resourceURL(e.name, a.kind, a.project), e.breadcrumbs = [ {
title: a.name,
link: a.returnURL
}, {
title: "Edit YAML"
} ];
var p = function() {
e.modified = !1, a.returnURL ? n.url(a.returnURL) : r.history.back();
}, g = [];
d.get(a.project).then(_.spread(function(n, r) {
var s = {
resource: o.kindToResource(a.kind),
group: a.group
};
i.canI(s, "update", a.project) ? (c.get(s, e.name, r, {
errorNotification: !1
}).then(function(n) {
var i = n;
_.set(e, "updated.resource", angular.copy(n)), e.$watch("updated.resource", function(t, n) {
t !== n && (e.modified = !0);
});
var l = function(e) {
return _.get(e, "metadata.resourceVersion");
};
e.save = function() {
var n = e.updated.resource;
if (e.modified = !1, n.kind === i.kind) {
var r = o.objectToResourceGroupVersion(i), s = o.objectToResourceGroupVersion(n);
s ? s.group === r.group ? o.apiInfo(s) ? (e.updatingNow = !0, c.update(r, i.metadata.name, n, {
namespace: i.metadata.namespace
}).then(function(t) {
var r = _.get(n, "metadata.resourceVersion");
if (_.get(t, "metadata.resourceVersion") === r) return e.alerts["no-changes-applied"] = {
type: "warning",
message: "No changes were applied to " + m(a.kind) + " " + a.name + ".",
details: "Make sure any new fields you may have added are supported API fields."
}, void (e.updatingNow = !1);
u.addNotification({
type: "success",
message: m(a.kind, !0) + " " + a.name + " was successfully updated."
}), p();
}, function(n) {
e.updatingNow = !1, e.error = {
message: t("getErrorDetails")(n)
};
})) : e.error = {
message: o.unsupportedObjectKindOrVersion(n)
} : e.error = {
message: "Cannot change resource group (original: " + (r.group || "<none>") + ", modified: " + (s.group || "<none>") + ")."
} : e.error = {
message: o.invalidObjectKindOrVersion(n)
};
} else e.error = {
message: "Cannot change resource kind (original: " + i.kind + ", modified: " + (n.kind || "<unspecified>") + ")."
};
}, e.cancel = function() {
p();
}, g.push(c.watchObject(s, e.name, r, function(t, n) {
e.resourceChanged = l(t) !== l(i), e.resourceDeleted = "DELETED" === n;
}, {
errorNotification: !1
}));
}, function(e) {
l.toErrorPage("Could not load " + m(a.kind) + " '" + a.name + "'. " + t("getErrorDetails")(e));
}), e.$on("$destroy", function() {
c.unwatchAll(g);
})) : l.toErrorPage("You do not have authority to update " + m(a.kind) + " " + a.name + ".", "access_denied");
}));
} else l.toErrorPage("Kind or name parameter missing.");
} ]), angular.module("openshiftConsole").controller("BrowseCategoryController", [ "$scope", "$filter", "$location", "$q", "$routeParams", "$uibModal", "Constants", "DataService", "LabelFilter", "Navigate", "ProjectsService", "gettext", function(e, t, n, a, r, o, i, s, c, l, u, d) {
e.projectName = r.project;
var m = function(t, n) {
var a;
return _.some(t, function(t) {
if (a = _.find(t.items, {
id: n
})) {
e.category = a;
var r = _.get(a, "subcategories", []);
return e.subcategories = [ {
id: "",
label: ""
} ].concat(r), !0;
}
return !1;
}), a;
}, p = i.CATALOG_CATEGORIES(d), g = "none" === r.category ? "" : r.category;
if (e.category = m(p, g), e.category) {
var f;
!r.subcategory || (e.category, g = "none" === r.subcategory ? "" : r.subcategory, f = _.get(e.category, "subcategories", []), e.category = m(f, g), e.category) ? (e.alerts = e.alerts || {}, u.get(r.project).then(_.spread(function(t, n) {
e.project = t, e.context = n, s.list("imagestreams", {
namespace: "openshift"
}).then(function(t) {
e.openshiftImageStreams = t.by("metadata.name");
}), s.list("templates", {
namespace: "openshift"
}, null, {
partialObjectMetadataList: !0
}).then(function(t) {
e.openshiftTemplates = t.by("metadata.name");
}), "openshift" === r.project ? (e.projectImageStreams = [], e.projectTemplates = []) : (s.list("imagestreams", n).then(function(t) {
e.projectImageStreams = t.by("metadata.name");
}), s.list("templates", n, null, {
partialObjectMetadataList: !0
}).then(function(t) {
e.projectTemplates = t.by("metadata.name");
}));
}))) : l.toErrorPage("Catalog category " + r.category + "/" + r.subcategory + " not found.");
} else l.toErrorPage("Catalog category " + r.category + " not found.");
} ]), angular.module("openshiftConsole").controller("CreateFromImageController", [ "$scope", "$filter", "$parse", "$q", "$routeParams", "$uibModal", "APIService", "ApplicationGenerator", "DataService", "HPAService", "ImagesService", "LimitRangesService", "Logger", "MetricsService", "Navigate", "NotificationsService", "ProjectsService", "QuotaService", "SOURCE_URL_PATTERN", "SecretsService", "TaskList", "failureObjectNameFilter", "keyValueEditorUtils", function(e, t, n, a, r, o, i, s, c, l, u, d, m, p, g, f, h, v, y, b, S, C, w) {
var P = t("displayName"), k = t("humanize");
e.projectName = r.project, e.sourceURLPattern = y;
var j = r.imageStream;
if (j) if (r.imageTag) {
e.displayName = r.displayName, e.advancedOptions = "true" === r.advanced;
var R = {
name: "app",
value: ""
}, I = t("orderByDisplayName"), T = t("getErrorDetails"), N = {}, A = function() {
f.hideNotification("create-builder-list-config-maps-error"), f.hideNotification("create-builder-list-secrets-error"), _.each(N, function(e) {
!e.id || "error" !== e.type && "warning" !== e.type || f.hideNotification(e.id);
});
};
e.$on("$destroy", A);
var E = i.getPreferredVersion("configmaps"), D = i.getPreferredVersion("limitranges"), $ = i.getPreferredVersion("imagestreams"), B = i.getPreferredVersion("imagestreamtags"), L = i.getPreferredVersion("secrets"), V = i.getPreferredVersion("resourcequotas"), U = i.getPreferredVersion("appliedclusterresourcequotas");
h.get(r.project).then(_.spread(function(t, n) {
e.project = t, r.sourceURI && (e.sourceURIinParams = !0), e.hasClusterResourceOverrides = d.hasClusterResourceOverrides(t);
var i = function() {
e.cpuProblems = d.validatePodLimits(e.limitRanges, "cpu", [ e.container ], t), e.memoryProblems = d.validatePodLimits(e.limitRanges, "memory", [ e.container ], t);
};
c.list(D, n).then(function(t) {
e.limitRanges = t.by("metadata.name"), _.isEmpty(e.limitRanges) || e.$watch("container", i, !0);
});
var h, y, C = function() {
e.scaling.autoscale && !e.hasClusterResourceOverrides ? e.showCPURequestWarning = !l.hasCPURequest([ e.container ], e.limitRanges, t) : e.showCPURequestWarning = !1;
};
c.list(V, n).then(function(e) {
h = e.by("metadata.name"), m.log("quotas", h);
}), c.list(U, n).then(function(e) {
y = e.by("metadata.name"), m.log("cluster quotas", y);
}), e.$watch("scaling.autoscale", C), e.$watch("container", C, !0), e.$watch("name", function(e, t) {
R.value && R.value !== t || (R.value = e);
}), function(a) {
a.name = r.name, a.imageName = j, a.imageTag = r.imageTag, a.namespace = r.namespace, a.buildConfig = {
buildOnSourceChange: !0,
buildOnImageChange: !0,
buildOnConfigChange: !0,
secrets: {
gitSecret: [ {
name: ""
} ]
},
sourceUrl: r.sourceURI,
gitRef: r.sourceRef,
contextDir: r.contextDir
}, a.buildConfigEnvVars = [], a.deploymentConfig = {
deployOnNewImage: !0,
deployOnConfigChange: !0
}, a.DCEnvVarsFromImage, a.DCEnvVarsFromUser = [], a.routing = {
include: !0,
portOptions: []
}, a.labelArray = [ R ], a.annotations = {}, a.scaling = {
replicas: 1,
autoscale: !1,
autoscaleOptions: [ {
label: "Manual",
value: !1
}, {
label: "Automatic",
value: !0
} ]
}, a.container = {
resources: {}
}, a.cpuRequestCalculated = d.isRequestCalculated("cpu", t), a.cpuLimitCalculated = d.isLimitCalculated("cpu", t), a.memoryRequestCalculated = d.isRequestCalculated("memory", t), a.fillSampleRepo = function() {
var e;
(a.image || a.image.metadata || a.image.metadata.annotations) && (e = a.image.metadata.annotations, a.buildConfig.sourceUrl = e.sampleRepo || "", a.buildConfig.gitRef = e.sampleRef || "", a.buildConfig.contextDir = e.sampleContextDir || "", (e.sampleRef || e.sampleContextDir) && (a.advancedSourceOptions = !0));
}, a.usingSampleRepo = function() {
return a.buildConfig.sourceUrl === _.get(a, "image.metadata.annotations.sampleRepo");
}, p.isAvailable().then(function(t) {
e.metricsWarning = !t;
});
var o = [], i = [];
e.valueFromObjects = [], c.list(E, n, null, {
errorNotification: !1
}).then(function(t) {
o = I(t.by("metadata.name")), e.valueFromObjects = o.concat(i);
}, function(e) {
403 !== e.code && f.addNotification({
id: "create-builder-list-config-maps-error",
type: "error",
message: "Could not load config maps.",
details: T(e)
});
}), c.list(L, n, null, {
errorNotification: !1
}).then(function(t) {
i = I(t.by("metadata.name")), e.valueFromObjects = o.concat(i);
var n = b.groupSecretsByType(t), a = _.mapValues(n, function(e) {
return _.map(e, "metadata.name");
});
e.secretsByType = _.each(a, function(e) {
e.unshift("");
});
}, function(e) {
403 !== e.code && f.addNotification({
id: "create-builder-list-secrets-error",
type: "error",
message: "Could not load secrets.",
details: T(e)
});
}), c.get($, a.imageName, {
namespace: a.namespace || r.project
}).then(function(e) {
a.imageStream = e;
var t = a.imageTag;
c.get(B, e.metadata.name + ":" + t, {
namespace: a.namespace
}).then(function(e) {
a.image = e.image, a.DCEnvVarsFromImage = u.getEnvironment(e);
var t = s.parsePorts(e.image);
_.isEmpty(t) ? (a.routing.include = !1, a.routing.portOptions = []) : (a.routing.portOptions = _.map(t, function(e) {
var t = s.getServicePort(e);
return {
port: t.name,
label: t.targetPort + "/" + t.protocol
};
}), a.routing.targetPort = a.routing.portOptions[0].port);
}, function() {
g.toErrorPage("Cannot create from source: the specified image could not be retrieved.");
});
}, function() {
g.toErrorPage("Cannot create from source: the specified image could not be retrieved.");
});
}(e);
var O, F = function() {
var t = {
started: "Creating application " + e.name + " in project " + e.projectDisplayName(),
success: "Created application " + e.name + " in project " + e.projectDisplayName(),
failure: "Failed to create " + e.name + " in project " + e.projectDisplayName()
}, o = {};
S.clear(), S.add(t, o, r.project, function() {
var t = a.defer();
return c.batch(O, n).then(function(n) {
var a = [], r = !1;
_.isEmpty(n.failure) ? a.push({
type: "success",
message: "All resources for application " + e.name + " were created successfully."
}) : (r = !0, n.failure.forEach(function(e) {
a.push({
type: "error",
message: "Cannot create " + k(e.object.kind).toLowerCase() + ' "' + e.object.metadata.name + '". ',
details: e.data.message
});
}), n.success.forEach(function(e) {
a.push({
type: "success",
message: "Created " + k(e.kind).toLowerCase() + ' "' + e.metadata.name + '" successfully. '
});
})), t.resolve({
alerts: a,
hasErrors: r
});
}), t.promise;
}), g.toNextSteps(e.name, e.projectName, {
usingSampleRepo: e.usingSampleRepo()
});
}, x = function(e) {
o.open({
templateUrl: "views/modals/confirm.html",
controller: "ConfirmModalController",
resolve: {
modalConfig: function() {
return {
alerts: e,
title: "Confirm Creation",
details: "Problems were detected while checking your application configuration.",
okButtonText: "Create Anyway",
okButtonClass: "btn-danger",
cancelButtonText: "Cancel"
};
}
}
}).result.then(F);
}, M = function(t) {
A(), N = t.quotaAlerts || [], e.nameTaken || _.some(N, {
type: "error"
}) ? (e.disableInputs = !1, _.each(N, function(e) {
e.id = _.uniqueId("create-builder-alert-"), f.addNotification(e);
})) : _.isEmpty(N) ? F() : (x(N), e.disableInputs = !1);
};
e.projectDisplayName = function() {
return P(this.project) || this.projectName;
}, e.createApp = function() {
e.disableInputs = !0, A(), e.buildConfig.envVars = w.compactEntries(e.buildConfigEnvVars), e.deploymentConfig.envVars = w.compactEntries(e.DCEnvVarsFromUser), e.labels = w.mapEntries(w.compactEntries(e.labelArray));
var t = s.generate(e);
O = [], angular.forEach(t, function(e) {
null !== e && (m.debug("Generated resource definition:", e), O.push(e));
});
var a = s.ifResourcesDontExist(O, e.projectName), r = v.getLatestQuotaAlerts(O, n), o = function(t) {
return e.nameTaken = t.nameTaken, r;
};
a.then(o, o).then(M, M);
};
})), e.cancel = function() {
g.toProjectOverview(e.projectName);
};
} else g.toErrorPage("Cannot create from source: a base image tag was not specified"); else g.toErrorPage("Cannot create from source: a base image was not specified");
} ]), angular.module("openshiftConsole").controller("NextStepsController", [ "$filter", "$routeParams", "$scope", "APIService", "DataService", "Logger", "ProjectsService", function(e, t, n, a, r, o, i) {
e("displayName");
var s = [];
n.alerts = [], n.loginBaseUrl = r.openshiftAPIBaseUrl(), n.buildConfigs = {}, n.projectName = t.project, n.fromSampleRepo = t.fromSample, n.name = t.name;
var c = a.getPreferredVersion("buildconfigs");
i.get(t.project).then(_.spread(function(e, a) {
n.project = e, s.push(r.watch(c, a, function(e) {
n.buildConfigs = e.by("metadata.name"), n.createdBuildConfig = n.buildConfigs[t.name], o.log("buildconfigs (subscribe)", n.buildConfigs);
})), n.$on("$destroy", function() {
r.unwatchAll(s);
});
}));
} ]), angular.module("openshiftConsole").controller("NewFromTemplateController", [ "$filter", "$location", "$parse", "$routeParams", "$scope", "AuthorizationService", "CachedTemplateService", "DataService", "Navigate", "NotificationsService", "ProjectsService", function(e, t, n, a, r, o, i, s, c, l, u) {
function d(e, t) {
var n = _.get(e, "spec.triggers", []), a = _.find(n, function(e) {
if ("ImageChange" !== e.type) return !1;
var n = _.get(e, "imageChangeParams.containerNames", []);
return _.includes(n, t.name);
});
return _.get(a, "imageChangeParams.from.name");
}
function m(e) {
for (var t = [], n = P.exec(e); n; ) t.push(n[1]), n = P.exec(e);
return t;
}
function p() {
var e = h();
r.templateImages = _.map(k, function(t) {
return _.isEmpty(t.usesParameters) ? t : {
name: _.template(t.name, {
interpolate: P
})(e),
usesParameters: t.usesParameters
};
});
}
function g(e) {
var t = [], n = b(e);
return n && angular.forEach(n, function(n) {
var a = n.image, r = d(e, n);
r && (a = r), a && t.push(a);
}), t;
}
function f(e) {
k = [];
var t = [], n = {};
angular.forEach(e.objects, function(e) {
if ("BuildConfig" === e.kind) {
var a = w(S(e), y);
a && k.push({
name: a,
usesParameters: m(a)
});
var r = w(C(e), y);
r && (n[r] = !0);
}
"DeploymentConfig" === e.kind && (t = t.concat(g(e)));
}), t.forEach(function(e) {
n[e] || k.push({
name: e,
usesParameters: m(e)
});
}), k = _.uniqBy(k, "name");
}
function h() {
var e = {};
return _.each(r.template.parameters, function(t) {
e[t.name] = t.value;
}), e;
}
var v = a.template, y = a.namespace || "", b = n("spec.template.spec.containers"), S = n("spec.strategy.sourceStrategy.from || spec.strategy.dockerStrategy.from || spec.strategy.customStrategy.from"), C = n("spec.output.to"), w = e("imageObjectRef");
if (v) {
a.templateParamsMap && (r.prefillParameters = function() {
try {
return JSON.parse(a.templateParamsMap);
} catch (e) {
l.addNotification({
id: "template-params-invalid-json",
type: "error",
message: "Could not prefill parameter values.",
details: "The `templateParamsMap` URL parameter is not valid JSON. " + e
});
}
}());
var P = /\${([a-zA-Z0-9\_]+)}/g, k = [];
u.get(a.project).then(_.spread(function(e) {
if (r.project = e, o.canI("processedtemplates", "create", a.project)) if (y) s.get("templates", v, {
namespace: y || r.project.metadata.name
}).then(function(e) {
r.template = e, f(e);
_.some(k, function(e) {
return !_.isEmpty(e.usesParameters);
}) ? (r.parameterDisplayNames = {}, _.each(e.parameters, function(e) {
r.parameterDisplayNames[e.name] = e.displayName || e.name;
}), r.$watch("template.parameters", _.debounce(function() {
r.$apply(p);
}, 50, {
maxWait: 250
}), !0)) : r.templateImages = k;
}, function() {
c.toErrorPage("Cannot create from template: the specified template could not be retrieved.");
}); else {
if (r.template = i.getTemplate(), _.isEmpty(r.template)) {
var n = URI("error").query({
error: "not_found",
error_description: "Template wasn't found in cache."
}).toString();
t.url(n);
}
i.clearTemplate();
} else c.toErrorPage("You do not have authority to process templates in project " + a.project + ".", "access_denied");
}));
} else c.toErrorPage("Cannot create from template: a template name was not specified.");
} ]), angular.module("openshiftConsole").controller("LabelsController", [ "$scope", function(e) {
e.expanded = !0, e.toggleExpanded = function() {
e.expanded = !e.expanded;
}, e.addLabel = function() {
e.labelKey && e.labelValue && (e.labels[e.labelKey] = e.labelValue, e.labelKey = "", e.labelValue = "", e.form.$setPristine(), e.form.$setUntouched());
}, e.deleteLabel = function(t) {
e.labels[t] && delete e.labels[t];
};
} ]), angular.module("openshiftConsole").controller("TasksController", [ "$scope", "TaskList", function(e, t) {
e.tasks = function() {
return t.taskList();
}, e.delete = function(e) {
t.deleteTask(e);
}, e.hasTaskWithError = function() {
var e = t.taskList();
return _.some(e, {
hasErrors: !0
});
};
} ]), angular.module("openshiftConsole").controller("EventsController", [ "$routeParams", "$scope", "ProjectsService", function(e, t, n) {
t.projectName = e.project, t.renderOptions = {
hideFilterWidget: !0
}, t.breadcrumbs = [ {
title: "Monitoring",
link: "project/" + e.project + "/monitoring"
}, {
title: "Events"
} ], n.get(e.project).then(_.spread(function(e, n) {
t.project = e, t.projectContext = n;
}));
} ]), angular.module("openshiftConsole").controller("OAuthController", [ "$scope", "$location", "$q", "APIService", "AuthService", "DataService", "Logger", "RedirectLoginService", function(e, t, n, a, r, o, i, s) {
var c = i.get("auth");
e.completeLogin = function() {}, e.cancelLogin = function() {
t.replace(), t.url("./");
};
var l = a.getPreferredVersion("users");
s.finish().then(function(n) {
var a = n.token, i = n.then, s = n.verified, u = n.ttl, d = {
errorNotification: !1,
http: {
auth: {
token: a,
triggerLogin: !1
}
}
};
c.log("OAuthController, got token, fetching user", d), o.get(l, "~", {}, d).then(function(n) {
if (c.log("OAuthController, got user", n), e.completeLogin = function() {
r.setUser(n, a, u);
var e = i || "./";
URI(e).is("absolute") && (c.log("OAuthController, invalid absolute redirect", e), e = "./"), c.log("OAuthController, redirecting", e), t.replace(), t.url(e);
}, s) e.completeLogin(); else {
e.confirmUser = n;
var o = r.UserStore().getUser();
o && o.metadata.name !== n.metadata.name && (e.overriddenUser = o);
}
}).catch(function(e) {
var n = URI("error").query({
error: "user_fetch_failed"
}).toString();
c.error("OAuthController, error fetching user", e, "redirecting", n), t.replace(), t.url(n);
});
}).catch(function(e) {
var n = URI("error").query({
error: e.error || "",
error_description: e.error_description || "",
error_uri: e.error_uri || ""
}).toString();
c.error("OAuthController, error", e, "redirecting", n), t.replace(), t.url(n);
});
} ]), angular.module("openshiftConsole").controller("ErrorController", [ "$scope", "$window", function(e, t) {
var n = URI(window.location.href).query(!0);
switch (n.error) {
case "access_denied":
e.errorMessage = "Access denied";
break;

case "not_found":
e.errorMessage = "Not found";
break;

case "invalid_request":
e.errorMessage = "Invalid request";
break;

case "API_DISCOVERY":
e.errorLinks = [ {
href: window.location.protocol + "//" + window.OPENSHIFT_CONFIG.api.openshift.hostPort + window.OPENSHIFT_CONFIG.api.openshift.prefix,
label: "Check Server Connection",
target: "_blank"
} ];
break;

default:
e.errorMessage = "An error has occurred";
}
n.error_description && (e.errorDetails = n.error_description), e.reloadConsole = function() {
t.location.href = "/";
};
} ]), angular.module("openshiftConsole").controller("LogoutController", [ "$scope", "$routeParams", "$log", "AuthService", "AUTH_CFG", function(e, t, n, a, r) {
if (n.debug("LogoutController"), a.isLoggedIn()) n.debug("LogoutController, logged in, initiating logout"), e.logoutMessage = "Logging out...", a.startLogout().finally(function() {
a.isLoggedIn() ? (n.debug("LogoutController, logout failed, still logged in"), e.logoutMessage = 'You could not be logged out. Return to the <a href="./">console</a>.') : r.logout_uri ? (n.debug("LogoutController, logout completed, redirecting to AUTH_CFG.logout_uri", r.logout_uri), window.location.href = r.logout_uri) : (n.debug("LogoutController, logout completed, reloading the page"), window.location.reload(!1));
}); else if (r.logout_uri) n.debug("LogoutController, logout completed, redirecting to AUTH_CFG.logout_uri", r.logout_uri), e.logoutMessage = "Logging out...", window.location.href = r.logout_uri; else {
n.debug("LogoutController, not logged in, logout complete");
var o = "You are logged out.";
"timeout" === t.cause && (o = "You have been logged out due to inactivity."), e.logoutMessage = o + ' Return to the <a href="./">console</a>.';
}
} ]), angular.module("openshiftConsole").controller("CreateController", [ "$scope", "$filter", "$location", "$q", "$routeParams", "$uibModal", "CatalogService", "Constants", "DataService", "LabelFilter", "Logger", "ProjectsService", "gettext", function(e, t, n, a, r, o, i, s, c, l, u, d, m) {
e.projectName = r.project, e.categories = s.CATALOG_CATEGORIES(m), e.alerts = e.alerts || {}, d.get(r.project).then(_.spread(function(t, n) {
e.project = t, e.context = n, c.list("imagestreams", {
namespace: "openshift"
}).then(function(t) {
e.openshiftImageStreams = t.by("metadata.name");
}), c.list("templates", {
namespace: "openshift"
}, null, {
partialObjectMetadataList: !0
}).then(function(t) {
e.openshiftTemplates = t.by("metadata.name");
}), "openshift" === r.project ? (e.projectImageStreams = [], e.projectTemplates = []) : (c.list("imagestreams", n).then(function(t) {
e.projectImageStreams = t.by("metadata.name");
}), c.list("templates", n, null, {
partialObjectMetadataList: !0
}).then(function(t) {
e.projectTemplates = t.by("metadata.name");
}));
}));
} ]), angular.module("openshiftConsole").controller("CreateFromURLController", [ "$scope", "$routeParams", "$location", "$filter", "APIService", "AuthService", "AuthorizationService", "DataService", "Navigate", "ProjectsService", function(e, t, n, a, r, o, i, s, c, l) {
o.withUser(), e.alerts = {}, e.selected = {};
var u = function(t) {
e.alerts.invalidImageStream = {
type: "error",
message: 'The requested image stream "' + t + '" could not be loaded.'
};
}, d = function(t) {
e.alerts.invalidImageTag = {
type: "error",
message: 'The requested image stream tag "' + t + '" could not be loaded.'
};
}, m = function(t) {
e.alerts.invalidTemplate = {
type: "error",
message: 'The requested template "' + t + '" could not be loaded.'
};
}, p = function() {
try {
return t.templateParamsMap && JSON.parse(t.templateParamsMap) || {};
} catch (t) {
e.alerts.invalidTemplateParams = {
type: "error",
message: "The templateParamsMap is not valid JSON. " + t
};
}
}, g = r.getPreferredVersion("imagestreams"), f = r.getPreferredVersion("imagestreamtags"), h = r.getPreferredVersion("templates"), v = window.OPENSHIFT_CONSTANTS.CREATE_FROM_URL_WHITELIST, y = [ "namespace", "name", "imageStream", "imageTag", "sourceURI", "sourceRef", "contextDir", "template", "templateParamsMap" ], b = _.pickBy(t, function(e, t) {
return _.includes(y, t) && _.isString(e);
});
b.namespace = b.namespace || "openshift";
_.includes(v, b.namespace) ? b.imageStream && b.template ? e.alerts.invalidResource = {
type: "error",
message: "Image streams and templates cannot be combined."
} : b.imageStream || b.template ? b.name && !function(e) {
return _.size(e) < 25 && /^[a-z]([-a-z0-9]*[a-z0-9])?$/.test(e);
}(b.name) ? function(t) {
e.alerts.invalidImageStream = {
type: "error",
message: 'The app name "' + t + "\" is not valid.  An app name is an alphanumeric (a-z, and 0-9) string with a maximum length of 24 characters, where the first character is a letter (a-z), and the '-' character is allowed anywhere except the first or last character."
};
}(b.name) : (b.imageStream && s.get(g, b.imageStream, {
namespace: b.namespace
}, {
errorNotification: !1
}).then(function(t) {
e.imageStream = t, s.get(f, t.metadata.name + ":" + b.imageTag, {
namespace: b.namespace
}, {
errorNotification: !1
}).then(function(t) {
e.imageStreamTag = t, e.validationPassed = !0, e.resource = t, b.displayName = a("displayName")(t);
}, function() {
d(b.imageTag);
});
}, function() {
u(b.imageStream);
}), b.template && s.get(h, b.template, {
namespace: b.namespace
}, {
errorNotification: !1
}).then(function(t) {
e.template = t, p() && (e.validationPassed = !0, e.resource = t);
}, function() {
m(b.template);
})) : e.alerts.resourceRequired = {
type: "error",
message: "An image stream or template is required."
} : function(t) {
e.alerts.invalidNamespace = {
type: "error",
message: 'Resources from the namespace "' + t + '" are not permitted.'
};
}(b.namespace), angular.extend(e, {
createDetails: b,
createWithProject: function(a) {
a = a || e.selected.project.metadata.name;
var r = t.imageStream ? c.createFromImageURL(e.imageStream, b.imageTag, a, b) : c.createFromTemplateURL(e.template, a, b);
n.url(r);
}
}), e.projects = {}, e.canCreateProject = void 0, l.list().then(function(t) {
e.loaded = !0, e.projects = a("orderByDisplayName")(t.by("metadata.name")), e.noProjects = _.isEmpty(e.projects);
}), l.canCreate().then(function() {
e.canCreateProject = !0;
}, function() {
e.canCreateProject = !1;
}), e.forms = {}, e.canIAddToProject = !0, e.canIAddToSelectedProject = function(t) {
var n = _.get(t, "metadata.name");
i.getProjectRules(n).then(function() {
e.canIAddToProject = i.canIAddToProject(n), e.forms && e.forms.selectProjectForm.selectProject.$setValidity("cannotAddToProject", e.canIAddToProject);
});
};
} ]), angular.module("openshiftConsole").controller("CreateProjectController", [ "$scope", "$location", "$window", "AuthService", "Constants", function(e, t, n, a, r) {
var o = !r.DISABLE_SERVICE_CATALOG_LANDING_PAGE;
e.onProjectCreated = function(e) {
o ? n.history.back() : t.path("project/" + e + "/create");
}, a.withUser();
} ]), angular.module("openshiftConsole").controller("EditProjectController", [ "$scope", "$routeParams", "$filter", "$location", "DataService", "ProjectsService", "Navigate", function(e, t, n, a, r, o, i) {
e.alerts = {};
var s = n("annotation"), c = n("annotationName");
o.get(t.project).then(_.spread(function(r) {
var l = function(e) {
return {
description: s(e, "description"),
displayName: s(e, "displayName")
};
}, u = function(e, t) {
var n = angular.copy(e);
return n.metadata.annotations[c("description")] = t.description, n.metadata.annotations[c("displayName")] = t.displayName, n;
};
angular.extend(e, {
project: r,
editableFields: l(r),
show: {
editing: !1
},
actions: {
canSubmit: !1
},
canSubmit: function(t) {
e.actions.canSubmit = t;
},
update: function() {
e.disableInputs = !0, o.update(t.project, u(r, e.editableFields)).then(function() {
t.then ? a.path(t.then) : i.toProjectOverview(r.metadata.name);
}, function(t) {
e.disableInputs = !1, e.editableFields = l(r), e.alerts.update = {
type: "error",
message: "An error occurred while updating the project",
details: n("getErrorDetails")(t)
};
});
}
});
}));
} ]), angular.module("openshiftConsole").controller("CreateRouteController", [ "$filter", "$routeParams", "$scope", "$window", "APIService", "ApplicationGenerator", "AuthorizationService", "DataService", "Navigate", "NotificationsService", "ProjectsService", "keyValueEditorUtils", function(e, t, n, a, r, o, i, s, c, l, u, d) {
n.renderOptions = {
hideFilterWidget: !0
}, n.projectName = t.project, n.serviceName = t.service, n.labels = [], n.routing = {
name: n.serviceName || ""
}, n.breadcrumbs = [ {
title: "Routes",
link: "project/" + n.projectName + "/browse/routes"
}, {
title: "Create Route"
} ];
var m = r.getPreferredVersion("routes"), p = r.getPreferredVersion("services"), g = function() {
l.hideNotification("create-route-error");
};
n.$on("$destroy", g);
var f = function() {
a.history.back();
};
n.cancel = f, u.get(t.project).then(_.spread(function(a, u) {
if (n.project = a, i.canI(m, "create", t.project)) {
var h, v = e("orderByDisplayName");
n.routing.to = {
kind: "Service",
name: n.serviceName,
weight: 1
};
var y, b = function() {
var e = y, t = _.get(n, "routing.to.name");
y = _.get(h, [ t, "metadata", "labels" ], {});
var a = d.mapEntries(d.compactEntries(n.labels)), r = _.assign(a, y);
e && (r = _.omitBy(r, function(t, n) {
return e[n] && !y[n];
})), n.labels = _.map(r, function(e, t) {
return {
name: t,
value: e
};
});
};
s.list(p, u).then(function(e) {
h = e.by("metadata.name"), n.services = v(h), n.$watch("routing.to.name", b);
}), n.createRoute = function() {
if (n.createRouteForm.$valid) {
g(), n.disableInputs = !0;
var t = n.routing.to.name, a = d.mapEntries(d.compactEntries(n.labels)), i = o.createRoute(n.routing, t, a), c = _.get(n, "routing.alternateServices", []);
_.isEmpty(c) || (i.spec.to.weight = _.get(n, "routing.to.weight"), i.spec.alternateBackends = _.map(c, function(e) {
return {
kind: "Service",
name: e.name,
weight: e.weight
};
}));
var m = r.objectToResourceGroupVersion(i);
s.create(m, null, i, u).then(function() {
l.addNotification({
type: "success",
message: "Route " + i.metadata.name + " was successfully created."
}), f();
}, function(t) {
n.disableInputs = !1, l.addNotification({
type: "error",
id: "create-route-error",
message: "An error occurred creating the route.",
details: e("getErrorDetails")(t)
});
});
}
};
} else c.toErrorPage("You do not have authority to create routes in project " + t.project + ".", "access_denied");
}));
} ]), angular.module("openshiftConsole").controller("AttachPVCController", [ "$filter", "$routeParams", "$scope", "$window", "APIService", "AuthorizationService", "BreadcrumbsService", "DataService", "QuotaService", "Navigate", "NotificationsService", "ProjectsService", "StorageService", "RELATIVE_PATH_PATTERN", function(e, t, n, a, r, o, i, s, c, l, u, d, m, p) {
if (t.kind && t.name) {
var g = [ "Deployment", "DeploymentConfig", "ReplicaSet", "ReplicationController" ], f = e("humanizeKind");
if (_.includes(g, t.kind)) {
var h = {
resource: r.kindToResource(t.kind),
group: t.group
};
n.projectName = t.project, n.kind = t.kind, n.name = t.name, n.RELATIVE_PATH_PATTERN = p, n.outOfClaims = !1, n.attach = {
persistentVolumeClaim: null,
volumeName: null,
mountPath: null,
allContainers: !0,
containers: {}
}, n.breadcrumbs = i.getBreadcrumbs({
name: t.name,
kind: t.kind,
namespace: t.project,
subpage: "Add Storage"
}), n.pvcVersion = r.getPreferredVersion("persistentvolumeclaims");
var v = r.getPreferredVersion("resourcequotas"), y = r.getPreferredVersion("appliedclusterresourcequotas");
d.get(t.project).then(_.spread(function(r, d) {
if (n.project = r, o.canI(h, "update", t.project)) {
var p = e("orderByDisplayName"), g = e("getErrorDetails"), b = e("generateName"), S = function(e, t) {
n.disableInputs = !0, u.addNotification({
id: "attach-pvc-error",
type: "error",
message: e,
details: t
});
}, C = function() {
u.hideNotification("attach-pvc-error");
};
n.$on("$destroy", C);
var w = function() {
a.history.back();
};
n.cancel = w;
var P = function(e) {
return n.attach.allContainers || n.attach.containers[e.name];
}, k = function() {
var e = _.get(n, "attach.resource.spec.template");
n.existingMountPaths = m.getMountPaths(e, P);
};
n.$watchGroup([ "attach.resource", "attach.allContainers" ], k), n.$watch("attach.containers", k, !0);
var j = function() {
var e = _.get(n, "attach.persistentVolumeClaim");
if (e) {
var t = _.get(n, "attach.resource.spec.template.spec.volumes"), a = _.find(t, {
persistentVolumeClaim: {
claimName: e.metadata.name
}
});
a ? (n.attach.volumeName = a.name, n.volumeAlreadyMounted = !0) : n.volumeAlreadyMounted && (n.attach.volumeName = "", n.volumeAlreadyMounted = !1);
}
};
n.onPVCSelected = j;
s.get(h, t.name, d).then(function(e) {
n.attach.resource = e, n.breadcrumbs = i.getBreadcrumbs({
object: e,
project: r,
subpage: "Add Storage"
});
var t = _.get(e, "spec.template");
n.existingVolumeNames = m.getVolumeNames(t), j();
}, function(e) {
S(t.name + " could not be loaded.", g(e));
}), s.list(n.pvcVersion, d).then(function(e) {
n.pvcs = p(e.by("metadata.name")), _.isEmpty(n.pvcs) || n.attach.persistentVolumeClaim || (n.attach.persistentVolumeClaim = _.head(n.pvcs), j());
}), s.list(v, {
namespace: n.projectName
}, function(e) {
n.quotas = e.by("metadata.name"), n.outOfClaims = c.isAnyStorageQuotaExceeded(n.quotas, n.clusterQuotas);
}), s.list(y, {
namespace: n.projectName
}, function(e) {
n.clusterQuotas = e.by("metadata.name"), n.outOfClaims = c.isAnyStorageQuotaExceeded(n.quotas, n.clusterQuotas);
}), n.attachPVC = function() {
if (n.disableInputs = !0, C(), n.attachPVCForm.$valid) {
n.attach.volumeName || (n.attach.volumeName = b("volume-"));
var e = n.attach.resource, a = _.get(e, "spec.template"), r = n.attach.persistentVolumeClaim, o = n.attach.volumeName, i = n.attach.mountPath, c = n.attach.subPath, l = n.attach.readOnly;
i && angular.forEach(a.spec.containers, function(e) {
if (P(e)) {
var t = m.createVolumeMount(o, i, c, l);
e.volumeMounts || (e.volumeMounts = []), e.volumeMounts.push(t);
}
}), n.volumeAlreadyMounted || (a.spec.volumes = a.spec.volumes || [], a.spec.volumes.push(m.createVolume(o, r))), s.update(h, e.metadata.name, n.attach.resource, d).then(function() {
var e;
i || (e = "No mount path was provided. The volume reference was added to the configuration, but it will not be mounted into running pods."), u.addNotification({
type: "success",
message: "Persistent volume claim " + r.metadata.name + " added to " + f(t.kind) + " " + t.name + ".",
details: e
}), w();
}, function(e) {
S("An error occurred attaching the persistent volume claim to the " + f(t.kind) + ".", g(e)), n.disableInputs = !1;
});
}
};
} else l.toErrorPage("You do not have authority to update " + f(t.kind) + " " + t.name + ".", "access_denied");
}));
} else l.toErrorPage("Storage is not supported for kind " + f(t.kind) + ".");
} else l.toErrorPage("Kind or name parameter missing.");
} ]), angular.module("openshiftConsole").controller("AddConfigVolumeController", [ "$filter", "$location", "$routeParams", "$scope", "$window", "APIService", "AuthorizationService", "BreadcrumbsService", "DataService", "Navigate", "NotificationsService", "ProjectsService", "StorageService", "RELATIVE_PATH_PATTERN", function(e, t, n, a, r, o, i, s, c, l, u, d, m, p) {
if (n.kind && n.name) {
var g = [ "Deployment", "DeploymentConfig", "ReplicaSet", "ReplicationController" ];
if (_.includes(g, n.kind)) {
var f = {
resource: o.kindToResource(n.kind),
group: n.group
};
a.projectName = n.project, a.kind = n.kind, a.name = n.name, a.attach = {
allContainers: !0,
pickKeys: !1
}, a.forms = {}, a.RELATIVE_PATH_PATTERN = p, a.breadcrumbs = s.getBreadcrumbs({
name: n.name,
kind: n.kind,
namespace: n.project,
subpage: "Add Config Files"
}), a.configMapVersion = o.getPreferredVersion("configmaps"), a.secretVersion = o.getPreferredVersion("secrets");
var h = e("humanizeKind");
a.groupByKind = function(e) {
return h(e.kind);
};
a.$watch("attach.source", function() {
_.set(a, "attach.items", [ {} ]);
});
var v = function() {
a.forms.addConfigVolumeForm.$setDirty();
}, y = function() {
r.history.back();
};
a.cancel = y;
var b = function(e, t) {
u.addNotification({
id: "add-config-volume-error",
type: "error",
message: e,
details: t
});
}, S = function() {
u.hideNotification("add-config-volume-error");
};
a.$on("$destroy", S), a.addItem = function() {
a.attach.items.push({}), v();
}, a.removeItem = function(e) {
a.attach.items.splice(e, 1), v();
}, d.get(n.project).then(_.spread(function(t, r) {
if (a.project = t, i.canI(f, "update", n.project)) {
var o = e("orderByDisplayName"), d = e("getErrorDetails"), p = e("generateName");
c.get(f, n.name, r, {
errorNotification: !1
}).then(function(e) {
a.targetObject = e, a.breadcrumbs = s.getBreadcrumbs({
object: e,
project: t,
subpage: "Add Config Files"
});
}, function(e) {
a.error = e;
}), c.list(a.configMapVersion, r, null, {
errorNotification: !1
}).then(function(e) {
a.configMaps = o(e.by("metadata.name"));
}, function(e) {
403 !== e.status ? b("Could not load config maps", d(e)) : a.configMaps = [];
}), c.list(a.secretVersion, r, null, {
errorNotification: !1
}).then(function(e) {
a.secrets = o(e.by("metadata.name"));
}, function(e) {
403 !== e.status ? b("Could not load secrets", d(e)) : a.secrets = [];
});
var g = function(e) {
return a.attach.allContainers || a.attach.containers[e.name];
}, v = function() {
var e = _.get(a, "targetObject.spec.template");
a.existingMountPaths = m.getMountPaths(e, g);
};
a.$watchGroup([ "targetObject", "attach.allContainers" ], v), a.$watch("attach.containers", v, !0);
a.$watch("attach.items", function() {
var e = _.map(a.attach.items, "path");
a.itemPaths = _.compact(e);
}, !0), a.addVolume = function() {
if (!a.forms.addConfigVolumeForm.$invalid) {
var t = a.targetObject, o = _.get(a, "attach.source"), i = _.get(t, "spec.template"), s = p("volume-"), l = {
name: s,
mountPath: _.get(a, "attach.mountPath")
};
"Secret" === o.kind && (l.readOnly = !0), _.each(i.spec.containers, function(e) {
g(e) && (e.volumeMounts = e.volumeMounts || [], e.volumeMounts.push(l));
});
var m, h = {
name: s
};
switch (a.attach.pickKeys && (m = a.attach.items), o.kind) {
case "ConfigMap":
h.configMap = {
name: o.metadata.name,
items: m
};
break;

case "Secret":
h.secret = {
secretName: o.metadata.name,
items: m
};
}
i.spec.volumes = i.spec.volumes || [], i.spec.volumes.push(h), a.disableInputs = !0, S();
var v = e("humanizeKind"), C = v(o.kind), w = v(n.kind);
c.update(f, t.metadata.name, a.targetObject, r).then(function() {
u.addNotification({
type: "success",
message: "Successfully added " + C + " " + o.metadata.name + " to " + w + " " + n.name + "."
}), y();
}, function(e) {
a.disableInputs = !1, b("An error occurred attaching the " + C + " to the " + w + ".", d(e));
});
}
};
} else l.toErrorPage("You do not have authority to update " + h(n.kind) + " " + n.name + ".", "access_denied");
}));
} else l.toErrorPage("Volumes are not supported for kind " + n.kind + ".");
} else l.toErrorPage("Kind or name parameter missing.");
} ]), angular.module("openshiftConsole").controller("CreateSecretModalController", [ "$scope", "$uibModalInstance", function(e, t) {
e.onCreate = function(e) {
t.close(e);
}, e.onCancel = function() {
t.dismiss("cancel");
};
} ]), angular.module("openshiftConsole").controller("ConfirmModalController", [ "$scope", "$uibModalInstance", "modalConfig", function(e, t, n) {
_.extend(e, n), e.confirm = function() {
t.close("confirm");
}, e.cancel = function() {
t.dismiss("cancel");
};
} ]), angular.module("openshiftConsole").controller("ConfirmScaleController", [ "$scope", "$uibModalInstance", "resource", "type", function(e, t, n, a) {
e.resource = n, e.type = a, e.confirmScale = function() {
t.close("confirmScale");
}, e.cancel = function() {
t.dismiss("cancel");
};
} ]), angular.module("openshiftConsole").controller("ConfirmSaveLogController", [ "$scope", "$uibModalInstance", "object", "CLIHelp", function(e, t, n, a) {
e.object = n, e.command = a.getLogsCommand(n), e.save = function() {
t.close("save");
}, e.cancel = function() {
t.dismiss("cancel");
};
} ]), angular.module("openshiftConsole").controller("DeleteModalController", [ "$scope", "$uibModalInstance", function(e, t) {
e.delete = function() {
t.close("delete");
}, e.cancel = function() {
t.dismiss("cancel");
};
} ]), angular.module("openshiftConsole").controller("EditPvcModalController", [ "APIService", "DataService", "$filter", "LimitRangesService", "QuotaService", "$scope", "$uibModalInstance", function(e, t, n, a, r, o, i) {
var s = e.getPreferredVersion("limitranges"), c = e.getPreferredVersion("resourcequotas"), l = e.getPreferredVersion("appliedclusterresourcequotas"), u = n("amountAndUnit"), d = (n("usageWithUnits"), n("usageValue")), m = u(o.pvc.spec.resources.requests.storage);
o.projectName = o.pvc.metadata.namespace, o.typeDisplayName = n("humanizeKind")(o.pvc.metadata.name), o.claim = {}, o.claim.capacity = Number(m[0]), o.claim.unit = m[1], o.disableButton = !0, o.currentCapacityUnits = angular.copy(o.claim), o.units = [ {
value: "Mi",
label: "MiB"
}, {
value: "Gi",
label: "GiB"
}, {
value: "Ti",
label: "TiB"
}, {
value: "M",
label: "MB"
}, {
value: "G",
label: "GB"
}, {
value: "T",
label: "TB"
} ], o.groupUnits = function(e) {
switch (e.value) {
case "Mi":
case "Gi":
case "Ti":
return "Binary Units";

case "M":
case "G":
case "T":
return "Decimal Units";
}
return "";
}, o.expand = function() {
o.updatedCapacity = o.claim.capacity + o.claim.unit, i.close(o.updatedCapacity);
}, o.cancel = function() {
i.dismiss("cancel");
};
var p = function() {
var e = o.claim.capacity && d(o.claim.capacity + o.claim.unit), t = !0, n = !0;
t = e >= (_.has(o, "limits.min") && d(o.limits.min)), n = e <= (_.has(o, "limits.max") && d(o.limits.max)), o.expandPersistentVolumeClaimForm.capacity.$setValidity("limitRangeMin", t), o.expandPersistentVolumeClaimForm.capacity.$setValidity("limitRangeMax", n);
}, g = function() {
var e = o.claim.capacity && d(o.claim.capacity + o.claim.unit), t = o.currentCapacityUnits.capacity && d(o.currentCapacityUnits.capacity + o.currentCapacityUnits.unit), n = r.isAnyStorageQuotaExceeded(o.quotas, o.clusterQuotas), a = r.willRequestExceedQuota(o.quotas, o.clusterQuotas, "requests.storage", e - t);
o.expandPersistentVolumeClaimForm.capacity.$setValidity("willExceedStorage", !a), o.expandPersistentVolumeClaimForm.capacity.$setValidity("outOfClaims", !n);
}, f = function(e) {
var t = (o.claim.capacity && d(o.claim.capacity + o.claim.unit)) > (o.currentCapacityUnits.capacity && d(o.currentCapacityUnits.capacity + o.currentCapacityUnits.unit));
o.expandPersistentVolumeClaimForm.capacity.$setValidity("checkCurrentCapacity", t);
};
t.list(s, {
namespace: o.projectName
}, function(e) {
var t = e.by("metadata.name");
if (o.$watchGroup([ "claim.capacity", "claim.unit" ], f), o.disableButton = !1, !_.isEmpty(t)) {
if (o.limits = a.getEffectiveLimitRange(t, "storage", "PersistentVolumeClaim"), o.limits.min && o.limits.max && d(o.limits.min) === d(o.limits.max)) {
var n = u(o.limits.max);
o.claim.capacity = Number(n[0]), o.claim.unit = n[1], o.capacityReadOnly = !0;
}
o.$watchGroup([ "claim.capacity", "claim.unit" ], p);
}
}), t.list(c, {
namespace: o.projectName
}, function(e) {
o.quotas = e.by("metadata.name"), o.$watchGroup([ "claim.capacity", "claim.unit" ], g);
}), t.list(l, {
namespace: o.projectName
}, function(e) {
o.clusterQuotas = e.by("metadata.name");
});
} ]), angular.module("openshiftConsole").controller("DebugTerminalModalController", [ "$scope", "$filter", "$uibModalInstance", "container", "image", function(e, t, n, a, r) {
e.container = a, e.image = r, e.$watch("debugPod.status.containerStatuses", function() {
e.containerState = _.get(e, "debugPod.status.containerStatuses[0].state");
}), e.close = function() {
n.close("close");
};
} ]), angular.module("openshiftConsole").controller("ConfirmReplaceModalController", [ "$scope", "$uibModalInstance", function(e, t) {
e.replace = function() {
t.close("replace");
}, e.cancel = function() {
t.dismiss("cancel");
};
} ]), angular.module("openshiftConsole").controller("ProcessOrSaveTemplateModalController", [ "$scope", "$uibModalInstance", function(e, t) {
e.continue = function() {
t.close("create");
}, e.cancel = function() {
t.dismiss("cancel");
};
} ]), angular.module("openshiftConsole").controller("LinkServiceModalController", [ "$scope", "$uibModalInstance", "ServicesService", function(e, t, n) {
e.$watch("services", function(t) {
var a = n.getDependentServices(e.service);
e.options = _.filter(t, function(t) {
return t !== e.service && !_.includes(a, t.metadata.name);
}), 1 === _.size(e.options) && _.set(e, "link.selectedService", _.head(e.options));
}), e.link = function() {
t.close(_.get(e, "link.selectedService"));
}, e.cancel = function() {
t.dismiss();
};
} ]), angular.module("openshiftConsole").controller("LogoutModalController", [ "$timeout", "$location", "$filter", "$scope", "$uibModalInstance", "Constants", function(e, t, n, a, r, o) {
a.endTimestamp = moment().add(30, "seconds").toString();
var i = e(function() {
a.logout();
}, 3e4);
a.logout = function() {
e.cancel(i), r.close("logout");
}, a.cancel = function() {
e.cancel(i), r.close("cancel");
}, a.$on("$destroy", function() {
e.cancel(i);
});
} ]), angular.module("openshiftConsole").controller("JenkinsfileExamplesModalController", [ "$scope", "$uibModalInstance", function(e, t) {
e.close = function() {
t.close("close");
};
} ]), angular.module("openshiftConsole").controller("AboutComputeUnitsModalController", [ "$scope", "$uibModalInstance", function(e, t) {
e.close = function() {
t.close("close");
};
} ]), angular.module("openshiftConsole").controller("SetHomePageModalController", [ "$scope", "$uibModalInstance", "HomePagePreferenceService", "ProjectsService", function(e, t, n, a) {
e.homePagePreference = n.getHomePagePreference(), e.availableProjects = [], e.selectedProject = null, e.onProjectSelected = function(t) {
e.selectedProject = t;
}, e.onOpen = function() {
e.homePagePreference = "project-overview";
}, e.preselectedProjectName = n.getHomePageProjectName(), a.list().then(function(t) {
e.availableProjects = _.toArray(t.by("metadata.name")), e.availableProjects = _.reject(e.availableProjects, "metadata.deletionTimestamp"), 1 === e.availableProjects.length ? e.selectedProject = e.availableProjects[0] : e.preselectedProjectName && (e.selectedProject = _.find(e.availableProjects, {
metadata: {
name: e.preselectedProjectName
}
}));
}), e.setHomePage = function() {
var a = {
type: e.homePagePreference
};
"project-overview" === e.homePagePreference && e.selectedProject && (a.project = e.selectedProject.metadata.name), n.setHomePagePreference(a), t.close("setHomePage");
}, e.cancel = function() {
t.dismiss("cancel");
};
} ]), angular.module("openshiftConsole").controller("AboutController", [ "$scope", "$q", "AuthService", "Constants", "DataService", function(e, t, n, a, r) {
n.withUser(), e.version = {
master: {},
console: a.VERSION.console || "unknown"
};
var o = e.version.master, i = [];
i.push(r.getKubernetesMasterVersion().then(function(e) {
o.kubernetes = e.data.gitVersion;
})), i.push(r.getOpenShiftMasterVersion().then(function(e) {
o.openshift = e.data.gitVersion;
})), t.all(i).finally(function() {
o.kubernetes = o.kubernetes || "unknown", o.openshift = o.openshift || "unknown";
});
} ]), angular.module("openshiftConsole").controller("CommandLineController", [ "$scope", "DataService", "AuthService", "Constants", function(e, t, n, a) {
n.withUser(), e.cliDownloadURL = a.CLI, e.cliDownloadURLPresent = e.cliDownloadURL && !_.isEmpty(e.cliDownloadURL), e.loginBaseURL = t.openshiftAPIBaseUrl(), a.DISABLE_COPY_LOGIN_COMMAND || (e.sessionToken = n.UserStore().getToken());
} ]), angular.module("openshiftConsole").controller("CreatePersistentVolumeClaimController", [ "$filter", "$routeParams", "$scope", "$window", "APIService", "ApplicationGenerator", "AuthorizationService", "DataService", "Navigate", "NotificationsService", "ProjectsService", "keyValueEditorUtils", function(e, t, n, a, r, o, i, s, c, l, u, d) {
n.projectName = t.project, n.accessModes = "ReadWriteOnce", n.claim = {}, n.breadcrumbs = [ {
title: "Storage",
link: "project/" + n.projectName + "/browse/storage"
}, {
title: "Create Storage"
} ];
var m = {
kind: "PersistentVolumeClaim",
apiVersion: "v1",
metadata: {
name: void 0,
labels: {},
annotations: {}
},
spec: {
resources: {
requests: {}
}
}
}, p = r.objectToResourceGroupVersion(m), g = function() {
l.hideNotification("create-pvc-error");
};
n.$on("$destroy", g);
var f = function() {
a.history.back();
};
n.cancel = f, u.get(t.project).then(_.spread(function(a, r) {
function o() {
var e = angular.copy(m);
e.metadata.name = n.claim.name, e.spec.accessModes = [ n.claim.accessModes || "ReadWriteOnce" ];
var t = n.claim.unit || "Mi";
if (e.spec.resources.requests.storage = n.claim.amount + t, n.claim.selectedLabels) {
var a = d.mapEntries(d.compactEntries(n.claim.selectedLabels));
_.isEmpty(a) || _.set(e, "spec.selector.matchLabels", a);
}
return n.claim.storageClass && "No Storage Class" !== n.claim.storageClass.metadata.name && (e.metadata.annotations["volume.beta.kubernetes.io/storage-class"] = n.claim.storageClass.metadata.name), e;
}
n.project = a, i.canI(p, "create", t.project) ? n.createPersistentVolumeClaim = function() {
if (g(), n.createPersistentVolumeClaimForm.$valid) {
n.disableInputs = !0;
var t = o();
s.create(p, null, t, r).then(function(e) {
l.addNotification({
type: "success",
message: "Persistent volume claim " + e.metadata.name + " successfully created."
}), f();
}, function(t) {
n.disableInputs = !1, l.addNotification({
id: "create-pvc-error",
type: "error",
message: "An error occurred requesting storage.",
details: e("getErrorDetails")(t)
});
});
}
} : c.toErrorPage("You do not have authority to create persistent volume claims in project " + t.project + ".", "access_denied");
}));
} ]), angular.module("openshiftConsole").directive("buildClose", [ "$window", function(e) {
var t = function(e) {
return "hide/build/" + e.metadata.uid;
}, n = function(e) {
var n = t(e);
return "true" === sessionStorage.getItem(n);
};
return {
restrict: "AE",
scope: {
build: "=",
hideBuild: "="
},
controller: [ "$scope", function(e) {
e.onHideBuild = function() {
var n = t(e.build);
e.hideBuild = !0, sessionStorage.setItem(n, "true");
};
} ],
link: function(e, t, a, r) {
e.hideBuild = !1, e.$watch("build", function(t) {
e.hideBuild = n(t);
});
},
templateUrl: "views/directives/_build-close.html"
};
} ]), angular.module("openshiftConsole").directive("createSecret", [ "$filter", "AuthorizationService", "APIService", "DataService", "NotificationsService", "ApplicationGenerator", "DNS1123_SUBDOMAIN_VALIDATION", function(e, t, n, a, r, o, i) {
var s = n.getPreferredVersion("serviceaccounts"), c = n.getPreferredVersion("secrets");
return {
restrict: "E",
scope: {
type: "=",
serviceAccountToLink: "=?",
namespace: "=",
onCreate: "&",
onCancel: "&"
},
templateUrl: "views/directives/create-secret.html",
link: function(l) {
l.serviceAccountsVersion = n.getPreferredVersion("serviceaccounts"), l.nameValidation = i, l.secretReferenceValidation = {
pattern: /^[a-zA-Z0-9\-_]+$/,
minLength: 8,
description: "Secret reference key must consist of lower-case, upper-case letters, numbers, dash, and underscore."
}, l.secretAuthTypeMap = {
generic: {
label: "Generic Secret",
authTypes: [ {
id: "Opaque",
label: "Generic Secret"
} ]
},
image: {
label: "Image Secret",
authTypes: [ {
id: "kubernetes.io/dockerconfigjson",
label: "Image Registry Credentials"
}, {
id: "kubernetes.io/dockercfg",
label: "Configuration File"
} ]
},
source: {
label: "Source Secret",
authTypes: [ {
id: "kubernetes.io/basic-auth",
label: "Basic Authentication"
}, {
id: "kubernetes.io/ssh-auth",
label: "SSH Key"
} ]
},
webhook: {
label: "Webhook Secret",
authTypes: [ {
id: "Opaque",
label: "Webhook Secret"
} ]
}
}, l.secretTypes = _.keys(l.secretAuthTypeMap), l.type ? l.newSecret = {
type: l.type,
authType: l.secretAuthTypeMap[l.type].authTypes[0].id,
data: {},
linkSecret: !_.isEmpty(l.serviceAccountToLink),
pickedServiceAccountToLink: l.serviceAccountToLink || ""
} : l.newSecret = {
type: "source",
authType: "kubernetes.io/basic-auth",
data: {
genericKeyValues: {
data: {}
}
},
linkSecret: !1,
pickedServiceAccountToLink: ""
}, l.add = {
gitconfig: !1,
cacert: !1
}, t.canI("serviceaccounts", "list") && t.canI("serviceaccounts", "update") && a.list(s, l, function(e) {
l.serviceAccounts = e.by("metadata.name"), l.serviceAccountsNames = _.keys(l.serviceAccounts);
});
var u = function(e, t) {
var a = {
apiVersion: n.toAPIVersion(c),
kind: "Secret",
metadata: {
name: l.newSecret.data.secretName
},
type: t,
stringData: {}
};
switch (t) {
case "kubernetes.io/basic-auth":
e.passwordToken ? a.stringData.password = e.passwordToken : a.type = "Opaque", e.username && (a.stringData.username = e.username), e.gitconfig && (a.stringData[".gitconfig"] = e.gitconfig), e.cacert && (a.stringData["ca.crt"] = e.cacert);
break;

case "kubernetes.io/ssh-auth":
a.stringData["ssh-privatekey"] = e.privateKey, e.gitconfig && (a.stringData[".gitconfig"] = e.gitconfig);
break;

case "kubernetes.io/dockerconfigjson":
var r = window.btoa(e.dockerUsername + ":" + e.dockerPassword), o = {
auths: {}
};
o.auths[e.dockerServer] = {
username: e.dockerUsername,
password: e.dockerPassword,
email: e.dockerMail,
auth: r
}, a.stringData[".dockerconfigjson"] = JSON.stringify(o);
break;

case "kubernetes.io/dockercfg":
var i = ".dockerconfigjson";
JSON.parse(e.dockerConfig).auths || (a.type = "kubernetes.io/dockercfg", i = ".dockercfg"), a.stringData[i] = e.dockerConfig;
break;

case "Opaque":
e.webhookSecretKey && (a.stringData.WebHookSecretKey = e.webhookSecretKey), _.get(e, "genericKeyValues.data") && (a.data = _.mapValues(e.genericKeyValues.data, window.btoa));
}
return a;
}, d = function() {
r.hideNotification("create-secret-error");
}, m = function(t) {
var o = angular.copy(l.serviceAccounts[l.newSecret.pickedServiceAccountToLink]), i = n.objectToResourceGroupVersion(o);
switch (l.newSecret.type) {
case "source":
o.secrets.push({
name: t.metadata.name
});
break;

case "image":
o.imagePullSecrets.push({
name: t.metadata.name
});
}
a.update(i, l.newSecret.pickedServiceAccountToLink, o, l).then(function(e) {
r.addNotification({
type: "success",
message: "Secret " + t.metadata.name + " was created and linked with service account " + e.metadata.name + "."
}), l.onCreate({
newSecret: t
});
}, function(n) {
r.addNotification({
type: "success",
message: "Secret " + t.metadata.name + " was created."
}), l.serviceAccountToLink || r.addNotification({
id: "secret-sa-link-error",
type: "error",
message: "An error occurred while linking the secret with service account " + l.newSecret.pickedServiceAccountToLink + ".",
details: e("getErrorDetails")(n)
}), l.onCreate({
newSecret: t
});
});
}, p = _.debounce(function() {
try {
JSON.parse(l.newSecret.data.dockerConfig), l.invalidConfigFormat = !1;
} catch (e) {
l.invalidConfigFormat = !0;
}
}, 300, {
leading: !0
});
l.aceChanged = p, l.nameChanged = function() {
l.nameTaken = !1;
}, l.generateWebhookSecretKey = function() {
l.newSecret.data.webhookSecretKey = o._generateSecret();
}, l.create = function() {
d();
var o = u(l.newSecret.data, l.newSecret.authType);
a.create(n.objectToResourceGroupVersion(o), null, o, l).then(function(e) {
l.newSecret.linkSecret && l.serviceAccountsNames.contains(l.newSecret.pickedServiceAccountToLink) && t.canI("serviceaccounts", "update") ? m(e) : (r.addNotification({
type: "success",
message: "Secret " + o.metadata.name + " was created."
}), l.onCreate({
newSecret: e
}));
}, function(t) {
"AlreadyExists" !== (t.data || {}).reason ? r.addNotification({
id: "create-secret-error",
type: "error",
message: "An error occurred while creating the secret.",
details: e("getErrorDetails")(t)
}) : l.nameTaken = !0;
});
}, l.cancel = function() {
d(), l.onCancel();
};
}
};
} ]), angular.module("openshiftConsole").directive("timeOnlyDurationUntilNow", function() {
return {
restrict: "E",
scope: {
timestamp: "=",
omitSingle: "=?",
precision: "=?"
},
template: '<span data-timestamp="{{timestamp}}" data-time-only="true" class="duration">{{timestamp | timeOnlyDurationFromTimestamps : null}}</span>'
};
}).directive("durationUntilNow", function() {
return {
restrict: "E",
scope: {
timestamp: "=",
omitSingle: "=?",
precision: "=?"
},
template: '<span data-timestamp="{{timestamp}}" data-omit-single="{{omitSingle}}" data-precision="{{precision}}" class="duration">{{timestamp | duration : null : omitSingle : precision}}</span>'
};
}).directive("timeRemainingFromNow", function() {
return {
restrict: "E",
scope: {
endTimestamp: "="
},
template: '<span data-timestamp="{{endTimestamp}}" class="countdown">{{endTimestamp | countdownToTimestamp}}</span>'
};
}), angular.module("openshiftConsole").directive("deleteLink", [ "$uibModal", "$location", "$filter", "$q", "hashSizeFilter", "APIService", "DataService", "Navigate", "NotificationsService", "Logger", function(e, t, n, a, r, o, i, s, c, l) {
var u = o.getPreferredVersion("horizontalpodautoscalers");
return {
restrict: "E",
scope: {
kind: "@",
group: "@?",
typeDisplayName: "@?",
resourceName: "@",
projectName: "@",
alerts: "=",
displayName: "@",
disableDelete: "=?",
typeNameToConfirm: "=?",
label: "@?",
buttonOnly: "@",
stayOnCurrentPage: "=?",
hpaList: "=?",
success: "=?",
redirectUrl: "@?"
},
templateUrl: function(e, t) {
return angular.isDefined(t.buttonOnly) ? "views/directives/delete-button.html" : "views/directives/delete-link.html";
},
replace: !0,
link: function(a, r, d) {
"Project" === d.kind && (a.isProject = !0), a.options = {
deleteHPAs: !0,
deleteImmediately: !1
};
var m = function(e) {
a.stayOnCurrentPage && a.alerts ? a.alerts[e.name] = e.data : c.addNotification(e.data);
}, p = function(e) {
return i.delete(u, e.metadata.name, {
namespace: a.projectName
}).then(function() {
c.addNotification({
type: "success",
message: "Horizontal pod autoscaler " + e.metadata.name + " was marked for deletion."
});
}).catch(function(t) {
m({
name: e.metadata.name,
data: {
type: "error",
message: "Horizontal pod autoscaler " + e.metadata.name + " could not be deleted."
}
}), l.error("HPA " + e.metadata.name + " could not be deleted.", t);
});
}, g = function() {
if (!a.stayOnCurrentPage) if (a.redirectUrl) t.url(a.redirectUrl); else if ("Project" === a.kind) if ("/" !== t.path()) {
var e = URI("/");
t.url(e);
} else a.$emit("deleteProject"); else s.toResourceList(o.kindToResource(a.kind), a.projectName);
};
a.openDeleteModal = function() {
a.disableDelete || e.open({
templateUrl: "views/modals/delete-resource.html",
controller: "DeleteModalController",
scope: a
}).result.then(function() {
var e = a.kind, t = a.resourceName, r = a.typeDisplayName || n("humanizeKind")(e), s = _.capitalize(r) + " '" + (a.displayName ? a.displayName : t) + "'", u = "Project" === a.kind ? {} : {
namespace: a.projectName
}, d = {};
a.options.deleteImmediately && (d.gracePeriodSeconds = 0, d.propagationPolicy = null), "servicecatalog.k8s.io" === a.group && (d.propagationPolicy = null), i.delete({
resource: o.kindToResource(e),
group: a.group
}, t, u, d).then(function() {
c.addNotification({
type: "success",
message: s + " was marked for deletion."
}), a.success && a.success(), a.options.deleteHPAs && _.each(a.hpaList, p), g();
}).catch(function(e) {
m({
name: t,
data: {
type: "error",
message: _.capitalize(s) + "' could not be deleted.",
details: n("getErrorDetails")(e)
}
}), l.error(s + " could not be deleted.", e);
});
});
};
}
};
} ]), angular.module("openshiftConsole").directive("editConfigMapOrSecret", [ "DNS1123_SUBDOMAIN_VALIDATION", function(e) {
return {
require: "^form",
restrict: "E",
scope: {
map: "=model",
showNameInput: "=",
type: "@",
readAsBinaryString: "=?"
},
templateUrl: "views/directives/edit-config-map-or-secret.html",
link: function(t, n, a, r) {
t.form = r, t.nameValidation = e, t.addItem = function() {
t.data.push({
key: "",
value: ""
}), t.form.$setDirty();
}, t.removeItem = function(e) {
t.data.splice(e, 1), t.form.$setDirty();
}, t.getKeys = function() {
return _.map(t.data, "key");
};
var o = t.$watch("map", function(e) {
e && (t.data = _.map(e.data, function(e, t) {
return {
key: t,
value: e
};
}), _.sortBy(t.data, "key"), _.isEmpty(t.data) && t.addItem(), o(), t.$watch("data", function(e) {
var n = {};
_.each(e, function(e) {
n[e.key] = e.value;
}), _.set(t, "map.data", n);
}, !0));
});
}
};
} ]), angular.module("openshiftConsole").directive("editPvc", [ "$uibModal", "$filter", "$routeParams", "APIService", "DataService", "ProjectsService", "NotificationsService", "Logger", function(e, t, n, a, r, o, i, s) {
return {
restrict: "E",
scope: {
pvc: "<"
},
template: '<a href="" ng-click="openEditModal()" role="button">Expand PVC</a>',
replace: !0,
link: function(n) {
n.openEditModal = function() {
var o = e.open({
templateUrl: "views/modals/edit-pvc-resource.html",
controller: "EditPvcModalController",
scope: n
}), c = function() {
i.hideNotification("expand-pvc-error");
};
n.$on("$destroy", c), o.result.then(function(e) {
c();
var o = angular.copy(n.pvc);
_.set(o, "spec.resources.requests.storage", e);
var l = n.pvc.kind, u = n.pvc.metadata.name, d = t("humanizeKind")(l) + " '" + u + "'";
r.update({
resource: a.kindToResource(l)
}, u, o, {
namespace: n.pvc.metadata.namespace
}).then(function() {
i.addNotification({
type: "success",
message: d + " expand request has been submitted."
});
}).catch(function(e) {
i.addNotification({
id: "expand-pvc-error",
type: "error",
message: "Could not save " + d,
details: t("getErrorDetails")(e)
}), s.error(d + " could not be expanded.", e);
});
});
};
}
};
} ]), function() {
angular.module("openshiftConsole").component("editEnvironmentFrom", {
controller: [ "$attrs", "$filter", "$scope", "keyValueEditorUtils", "SecretsService", function(e, t, n, a, r) {
var o = this, i = t("canI"), s = t("humanizeKind"), c = _.uniqueId(), l = /^[A-Za-z_][A-Za-z0-9_]*$/, u = !1;
o.setFocusClass = "edit-environment-from-set-focus-" + c, o.isEnvVarInvalid = function(e) {
return !l.test(e);
}, o.hasInvalidEnvVar = function(e) {
return _.some(e, function(e, t) {
return o.isEnvVarInvalid(t);
});
}, o.viewOverlayPanel = function(e) {
o.decodedData = e.data, o.overlayPaneEntryDetails = e, "Secret" === e.kind && (o.decodedData = r.decodeSecretData(e.data)), o.overlayPanelVisible = !0;
}, o.closeOverlayPanel = function() {
o.showSecret = !1, o.overlayPanelVisible = !1;
};
var d = function(e, t) {
e && e.push(t || {});
};
o.onAddRow = function() {
d(o.envFromEntries), a.setFocusOn("." + o.setFocusClass);
}, o.deleteEntry = function(e, t) {
o.envFromEntries && !o.envFromEntries.length || (o.envFromEntries.splice(e, t), o.envFromEntries.length || d(o.envFromEntries), o.updateEntries(o.envFromEntries), o.editEnvironmentFromForm.$setDirty());
}, o.hasOptions = function() {
return !_.isEmpty(o.envFromSelectorOptions);
}, o.hasEntries = function() {
return _.some(o.entries, function(e) {
return _.get(e, "configMapRef.name") || _.get(e, "secretRef.name");
});
}, o.isEnvFromReadonly = function(e) {
return !0 === o.isReadonly || e && !0 === e.isReadonly;
}, o.groupByKind = function(e) {
return s(e.kind);
}, o.dragControlListeners = {
accept: function(e, t) {
return e.itemScope.sortableScope.$id === t.$id;
},
orderChanged: function() {
o.editEnvironmentFromForm.$setDirty();
}
}, o.envFromObjectSelected = function(e, t, n) {
var a = {};
switch (n.kind) {
case "Secret":
a.secretRef = {
name: n.metadata.name
}, delete o.envFromEntries[e].configMapRef;
break;

case "ConfigMap":
a.configMapRef = {
name: n.metadata.name
}, delete o.envFromEntries[e].secretRef;
}
t.prefix && (a.prefix = t.prefix), _.assign(o.envFromEntries[e], a), o.updateEntries(o.envFromEntries);
}, o.updateEntries = function(e) {
u = !0, o.entries = _.filter(e, function(e) {
return e.secretRef || e.configMapRef;
});
};
var m = function() {
var e = {}, t = {};
o.envFromEntries = o.entries || [], o.envFromEntries.length || d(o.envFromEntries), _.each(o.envFromSelectorOptions, function(n) {
switch (n.kind) {
case "ConfigMap":
e[n.metadata.name] = n;
break;

case "Secret":
t[n.metadata.name] = n;
}
}), _.each(o.envFromEntries, function(n) {
var a, r;
if (n.configMapRef && (a = "configMapRef", r = "configmaps"), n.secretRef && (a = "secretRef", r = "secrets"), a && r) {
var o = n[a].name;
n.configMapRef && o in e && (n.selectedEnvFrom = e[o]), n.secretRef && o in t && (n.selectedEnvFrom = t[o]), i(r, "get") || (n.isReadonly = !0);
}
});
};
o.$onInit = function() {
m(), "cannotDelete" in e && (o.cannotDeleteAny = !0), "cannotSort" in e && (o.cannotSort = !0), "showHeader" in e && (o.showHeader = !0), o.envFromEntries && !o.envFromEntries.length && d(o.envFromEntries);
}, n.$watch("$ctrl.entries", function() {
u ? u = !1 : m();
}), o.$onChanges = function(e) {
e.envFromSelectorOptions && m();
};
} ],
bindings: {
entries: "=",
envFromSelectorOptions: "<",
isReadonly: "<?"
},
templateUrl: "views/directives/edit-environment-from.html"
});
}(), angular.module("openshiftConsole").directive("events", [ "$routeParams", "$filter", "APIService", "DataService", "KeywordService", "Logger", function(e, t, n, a, r, o) {
return {
restrict: "E",
scope: {
apiObjects: "=?",
projectContext: "="
},
templateUrl: "views/directives/events.html",
controller: [ "$scope", function(e) {
var t, i = {}, s = [], c = n.getPreferredVersion("events");
e.filter = {
text: ""
};
var l = function(e) {
return _.isEmpty(i) ? e : _.filter(e, function(e) {
return i[e.involvedObject.uid];
});
}, u = [], d = _.get(e, "sortConfig.currentField.id"), m = {
lastTimestamp: !0
}, p = function() {
var t = _.get(e, "sortConfig.currentField.id", "lastTimestamp");
d !== t && (d = t, e.sortConfig.isAscending = !m[d]);
var n = e.sortConfig.isAscending ? "asc" : "desc";
u = _.orderBy(e.events, [ t, "metadata.resourceVersion" ], [ n, n ]);
}, g = [], f = function() {
e.filterExpressions = g = r.generateKeywords(_.get(e, "filter.text"));
}, h = [ "reason", "message", "type" ];
e.resourceKind && e.resourceName || h.splice(0, 0, "involvedObject.name", "involvedObject.kind");
var v = function() {
e.filteredEvents = r.filterForKeywords(u, h, g);
};
e.$watch("filter.text", _.debounce(function() {
f(), e.$evalAsync(v);
}, 50, {
maxWait: 250
}));
var y = function() {
p(), v();
}, b = _.debounce(function() {
t && e.$evalAsync(function() {
e.events = l(t), y();
});
}, 250, {
leading: !0,
trailing: !0,
maxWait: 1e3
});
e.$watch("apiObjects", function(n) {
i = {}, _.each(n, function(e) {
_.get(e, "metadata.uid") && (i[e.metadata.uid] = !0);
}), e.showKindAndName = 1 !== _.size(i), t && b();
}), e.$watch("showKindAndName", function(t) {
e.sortConfig = {
fields: [ {
id: "lastTimestamp",
title: "Time",
sortType: "alpha"
}, {
id: "type",
title: "Severity",
sortType: "alpha"
}, {
id: "reason",
title: "Reason",
sortType: "alpha"
}, {
id: "message",
title: "Message",
sortType: "alpha"
}, {
id: "count",
title: "Count",
sortType: "numeric"
} ],
isAscending: !0,
onSortChange: y
}, t && e.sortConfig.fields.splice(1, 0, {
id: "involvedObject.name",
title: "Name",
sortType: "alpha"
}, {
id: "involvedObject.kind",
title: "Kind",
sortType: "alpha"
});
}), s.push(a.watch(c, e.projectContext, function(n) {
t = n.by("metadata.name"), b(), o.log("events (subscribe)", e.filteredEvents);
}, {
skipDigest: !0
})), e.$on("$destroy", function() {
a.unwatchAll(s);
});
} ]
};
} ]), angular.module("openshiftConsole").directive("eventsSidebar", [ "$rootScope", "APIService", "DataService", "Logger", function(e, t, n, a) {
var r = t.getPreferredVersion("events");
return {
restrict: "E",
scope: {
projectContext: "=",
collapsed: "="
},
templateUrl: "views/directives/events-sidebar.html",
controller: [ "$scope", function(t) {
var o = [];
o.push(n.watch(r, t.projectContext, function(e) {
var n = e.by("metadata.name");
t.events = _.orderBy(n, [ "lastTimestamp" ], [ "desc" ]), t.warningCount = _.size(_.filter(n, {
type: "Warning"
})), a.log("events (subscribe)", t.events);
})), t.highlightedEvents = {}, t.collapseSidebar = function() {
t.collapsed = !0;
};
var i = [];
i.push(e.$on("event.resource.highlight", function(e, n) {
var a = _.get(n, "kind"), r = _.get(n, "metadata.name");
a && r && _.each(t.events, function(e) {
e.involvedObject.kind === a && e.involvedObject.name === r && (t.highlightedEvents[a + "/" + r] = !0);
});
})), i.push(e.$on("event.resource.clear-highlight", function(e, n) {
var a = _.get(n, "kind"), r = _.get(n, "metadata.name");
a && r && _.each(t.events, function(e) {
e.involvedObject.kind === a && e.involvedObject.name === r && (t.highlightedEvents[a + "/" + r] = !1);
});
})), t.$on("$destroy", function() {
n.unwatchAll(o), _.each(i, function(e) {
e();
}), i = null;
});
} ]
};
} ]), angular.module("openshiftConsole").directive("eventsBadge", [ "$filter", "APIService", "DataService", "Logger", function(e, t, n, a) {
var r = t.getPreferredVersion("events");
return {
restrict: "E",
scope: {
projectContext: "=",
sidebarCollapsed: "="
},
templateUrl: "views/directives/events-badge.html",
controller: [ "$scope", function(t) {
var o = [], i = e("orderObjectsByDate");
o.push(n.watch(r, t.projectContext, function(e) {
var n = e.by("metadata.name");
t.events = i(n, !0), t.warningCount = _.size(_.filter(n, {
type: "Warning"
})), t.normalCount = _.size(_.filter(n, {
type: "Normal"
})), a.log("events (subscribe)", t.events);
})), t.expandSidebar = function() {
t.sidebarCollapsed = !1;
}, t.$on("$destroy", function() {
n.unwatchAll(o);
});
} ]
};
} ]), angular.module("openshiftConsole").directive("fromFile", [ "$filter", "$location", "$q", "$uibModal", "APIService", "CachedTemplateService", "DataService", "Navigate", "NotificationsService", "QuotaService", "SecurityCheckService", "TaskList", "ProjectsService", function(e, t, n, a, r, o, i, s, c, l, u, d, m) {
return {
restrict: "E",
scope: {
project: "=",
isDialog: "="
},
templateUrl: "views/directives/from-file.html",
controller: [ "$scope", function(p) {
function g(e) {
return !!e.kind || (p.error = {
message: "Resource is missing kind field."
}, !1);
}
function f(e) {
return !!p.isList || (e.metadata ? e.metadata.name ? !e.metadata.namespace || e.metadata.namespace === p.input.selectedProject.metadata.name || (p.error = {
message: e.kind + " " + e.metadata.name + " can't be created in project " + e.metadata.namespace + ". Can't create resource in different projects."
}, !1) : (p.error = {
message: "Resource name is missing in metadata field."
}, !1) : (p.error = {
message: "Resource is missing metadata field."
}, !1));
}
function h() {
a.open({
templateUrl: "views/modals/process-or-save-template.html",
controller: "ProcessOrSaveTemplateModalController",
scope: p
}).result.then(function() {
p.templateOptions.add ? y() : (o.setTemplate(p.resourceList[0]), b());
});
}
function v() {
a.open({
templateUrl: "views/modals/confirm-replace.html",
controller: "ConfirmReplaceModalController",
scope: p
}).result.then(function() {
l.getLatestQuotaAlerts(p.createResources, {
namespace: p.input.selectedProject.metadata.name
}).then(A);
});
}
function y() {
var e = p.createResources.length, t = p.updateResources.length;
if (p.resourceKind.endsWith("List")) {
var a = [];
t > 0 && a.push(P()), e > 0 && a.push(w()), n.all(a).then(b);
} else C();
}
function b() {
var e, n;
N(), "Template" === p.resourceKind && p.templateOptions.process && !p.errorOccurred ? p.isDialog ? p.$emit("fileImportedFromYAMLOrJSON", {
project: p.input.selectedProject,
template: p.resource
}) : (n = p.templateOptions.add || p.updateResources.length > 0 ? p.input.selectedProject.metadata.name : "", e = s.createFromTemplateURL(p.resource, p.input.selectedProject.metadata.name, {
namespace: n
}), t.url(e)) : p.isDialog ? p.$emit("fileImportedFromYAMLOrJSON", {
project: p.input.selectedProject,
resource: p.resource,
isList: p.isList
}) : (e = s.projectOverviewURL(p.input.selectedProject.metadata.name), t.url(e));
}
function S(e) {
var t = r.objectToResourceGroupVersion(e);
return t ? r.apiInfo(t) ? i.get(t, e.metadata.name, {
namespace: p.input.selectedProject.metadata.name
}, {
errorNotification: !1
}).then(function(t) {
var n = angular.copy(e), a = angular.copy(t.metadata);
a.annotations = e.metadata.annotations, a.labels = e.metadata.labels, n.metadata = a, p.updateResources.push(n);
}, function() {
var t = angular.copy(e);
_.unset(t, "metadata.resourceVersion"), p.createResources.push(t);
}) : (p.errorOccurred = !0, void (p.error = {
message: r.unsupportedObjectKindOrVersion(e)
})) : (p.errorOccurred = !0, void (p.error = {
message: r.invalidObjectKindOrVersion(e)
}));
}
function C() {
var t;
_.isEmpty(p.createResources) ? (t = _.head(p.updateResources), i.update(r.objectToResourceGroupVersion(t), t.metadata.name, t, {
namespace: p.input.selectedProject.metadata.name
}).then(function() {
if (!p.isDialog) {
var e = j(t.kind);
c.addNotification({
type: "success",
message: _.capitalize(e) + " " + t.metadata.name + " was successfully updated."
});
}
b();
}, function(n) {
c.addNotification({
id: "from-file-error",
type: "error",
message: "Unable to update the " + j(t.kind) + " '" + t.metadata.name + "'.",
details: e("getErrorDetails")(n)
});
})) : (t = _.head(p.createResources), i.create(r.objectToResourceGroupVersion(t), null, t, {
namespace: p.input.selectedProject.metadata.name
}).then(function() {
if (!p.isDialog) {
var e = j(t.kind);
c.addNotification({
type: "success",
message: _.capitalize(e) + " " + t.metadata.name + " was successfully created."
});
}
b();
}, function(n) {
c.addNotification({
id: "from-file-error",
type: "error",
message: "Unable to create the " + j(t.kind) + " '" + t.metadata.name + "'.",
details: e("getErrorDetails")(n)
});
}));
}
function w() {
var e = {
started: "Creating resources in project " + D(p.input.selectedProject),
success: "Creating resources in project " + D(p.input.selectedProject),
failure: "Failed to create some resources in project " + D(p.input.selectedProject)
}, t = {};
d.add(e, t, p.input.selectedProject.metadata.name, function() {
var e = n.defer();
return i.batch(p.createResources, {
namespace: p.input.selectedProject.metadata.name
}, "create").then(function(t) {
var n = [], a = !1;
if (t.failure.length > 0) a = !0, p.errorOccurred = !0, t.failure.forEach(function(e) {
n.push({
type: "error",
message: "Cannot create " + j(e.object.kind) + ' "' + e.object.metadata.name + '". ',
details: e.data.message
});
}), t.success.forEach(function(e) {
n.push({
type: "success",
message: "Created " + j(e.kind) + ' "' + e.metadata.name + '" successfully. '
});
}); else {
var r;
r = p.isList ? "All items in list were created successfully." : j(p.resourceKind) + " " + p.resourceName + " was successfully created.", n.push({
type: "success",
message: r
});
}
e.resolve({
alerts: n,
hasErrors: a
});
}), e.promise;
});
}
function P() {
var e = {
started: "Updating resources in project " + D(p.input.selectedProject),
success: "Updated resources in project " + D(p.input.selectedProject),
failure: "Failed to update some resources in project " + D(p.input.selectedProject)
}, t = {};
d.add(e, t, p.input.selectedProject.metadata.name, function() {
var e = n.defer();
return i.batch(p.updateResources, {
namespace: p.input.selectedProject.metadata.name
}, "update").then(function(t) {
var n = [], a = !1;
if (t.failure.length > 0) a = !0, p.errorOccurred = !0, t.failure.forEach(function(e) {
n.push({
type: "error",
message: "Cannot update " + j(e.object.kind) + ' "' + e.object.metadata.name + '". ',
details: e.data.message
});
}), t.success.forEach(function(e) {
n.push({
type: "success",
message: "Updated " + j(e.kind) + ' "' + e.metadata.name + '" successfully. '
});
}); else {
var r;
r = p.isList ? "All items in list were updated successfully." : j(p.resourceKind) + " " + p.resourceName + " was successfully updated.", n.push({
type: "success",
message: r
});
}
e.resolve({
alerts: n,
hasErrors: a
});
}, function(t) {
var n = [];
n.push({
type: "error",
message: "An error occurred updating the resources.",
details: "Status: " + t.status + ". " + t.data
}), e.resolve({
alerts: n
});
}), e.promise;
});
}
var k;
p.noProjectsCantCreate = !1;
var j = e("humanizeKind"), R = e("getErrorDetails");
d.clear(), p.$on("no-projects-cannot-create", function() {
p.noProjectsCantCreate = !0;
}), p.input = {
selectedProject: p.project
}, p.$watch("input.selectedProject.metadata.name", function() {
p.projectNameTaken = !1;
}), p.aceLoaded = function(e) {
(k = e.getSession()).setOption("tabSize", 2), k.setOption("useSoftTabs", !0), e.setDragDelay = 0, e.$blockScrolling = 1 / 0;
};
var I = function(e) {
a.open({
templateUrl: "views/modals/confirm.html",
controller: "ConfirmModalController",
resolve: {
modalConfig: function() {
return {
alerts: e,
title: "Confirm Creation",
details: "We checked your application for potential problems. Please confirm you still want to create this application.",
okButtonText: "Create Anyway",
okButtonClass: "btn-danger",
cancelButtonText: "Cancel"
};
}
}
}).result.then(y);
}, T = {}, N = function() {
c.hideNotification("from-file-error"), _.each(T, function(e) {
!e.id || "error" !== e.type && "warning" !== e.type || c.hideNotification(e.id);
});
}, A = function(e) {
N(), T = u.getSecurityAlerts(p.createResources, p.input.selectedProject.metadata.name);
var t = e.quotaAlerts || [];
T = T.concat(t), _.filter(T, {
type: "error"
}).length ? (_.each(T, function(e) {
e.id = _.uniqueId("from-file-alert-"), c.addNotification(e);
}), p.disableInputs = !1) : T.length ? (I(T), p.disableInputs = !1) : y();
}, E = function() {
if (_.has(p.input.selectedProject, "metadata.uid")) return n.when(p.input.selectedProject);
var t = p.input.selectedProject.metadata.name, a = p.input.selectedProject.metadata.annotations["new-display-name"], r = e("description")(p.input.selectedProject);
return m.create(t, a, r);
};
p.create = function() {
if (delete p.error, g(p.resource) && (p.resourceKind = p.resource.kind, p.resourceKind.endsWith("List") ? p.isList = !0 : p.isList = !1, f(p.resource))) {
p.isList ? (p.resourceList = p.resource.items, p.resourceName = "") : (p.resourceList = [ p.resource ], p.resourceName = p.resource.metadata.name, "Template" === p.resourceKind && (p.templateOptions = {
process: !0,
add: !1
})), p.updateResources = [], p.createResources = [];
var e = [];
p.errorOccurred = !1, _.forEach(p.resourceList, function(t) {
if (!f(t)) return p.errorOccurred = !0, !1;
e.push(S(t));
}), E().then(function(t) {
p.input.selectedProject = t, n.all(e).then(function() {
p.errorOccurred || (1 === p.createResources.length && "Template" === p.resourceList[0].kind ? h() : _.isEmpty(p.updateResources) ? l.getLatestQuotaAlerts(p.createResources, {
namespace: p.input.selectedProject.metadata.name
}).then(A) : (p.updateTemplate = 1 === p.updateResources.length && "Template" === p.updateResources[0].kind, p.updateTemplate ? h() : v()));
});
}, function(e) {
"AlreadyExists" === e.data.reason ? p.projectNameTaken = !0 : c.addNotification({
id: "import-create-project-error",
type: "error",
message: "An error occurred creating project.",
details: R(e)
});
});
}
}, p.cancel = function() {
N(), s.toProjectOverview(p.input.selectedProject.metadata.name);
};
var D = e("displayName");
p.$on("importFileFromYAMLOrJSON", p.create), p.$on("$destroy", N);
} ]
};
} ]), angular.module("openshiftConsole").directive("oscFileInput", [ "$filter", "Logger", "NotificationsService", function(e, t, n) {
return {
restrict: "E",
scope: {
model: "=",
required: "<",
disabled: "<ngDisabled",
readonly: "<ngReadonly",
showTextArea: "<",
hideClear: "<?",
helpText: "@?",
dropZoneId: "@?",
onFileAdded: "<?",
readAsBinaryString: "<?",
isBinaryFile: "=?"
},
templateUrl: "views/directives/osc-file-input.html",
link: function(a, r) {
function o(r) {
if (r.size > 5242880) n.addNotification({
type: "error",
message: "The file is too large.",
details: "The file " + r.name + " is " + e("humanizeSize")(r.size) + ". The web console has a 5 MiB file limit."
}); else {
var o = new FileReader();
o.onloadend = function() {
a.$apply(function() {
a.fileName = r.name, a.model = o.result, a.isBinaryFile = s(o.result);
var e = a.onFileAdded;
_.isFunction(e) && e(o.result), o.error || (a.uploadError = !1);
});
}, o.onerror = function(e) {
a.uploadError = !0, t.error("Could not read file", e);
}, a.readAsBinaryString ? o.readAsBinaryString(r) : o.readAsText(r);
}
}
function i() {
r.find(".drag-and-drop-zone").removeClass("show-drag-and-drop-zone highlight-drag-and-drop-zone");
}
var s = e("isNonPrintable"), c = _.uniqueId("osc-file-input-");
a.dropMessageID = c + "-drop-message", a.helpID = c + "-help", a.supportsFileUpload = window.File && window.FileReader && window.FileList && window.Blob, a.uploadError = !1;
var l = "#" + a.dropMessageID, u = !1, d = !1, m = r.find("input[type=file]");
setTimeout(function() {
var e = r.find(".drag-and-drop-zone");
e.on("dragover", function() {
a.disabled || (e.addClass("highlight-drag-and-drop-zone"), u = !0);
}), r.find(".drag-and-drop-zone p").on("dragover", function() {
a.disabled || (u = !0);
}), e.on("dragleave", function() {
a.disabled || (u = !1, _.delay(function() {
u || e.removeClass("highlight-drag-and-drop-zone");
}, 200));
}), e.on("drop", function(e) {
if (!a.disabled) {
var t = _.get(e, "originalEvent.dataTransfer.files", []);
return t.length > 0 && (a.file = _.head(t), o(a.file)), i(), $(".drag-and-drop-zone").trigger("putDropZoneFront", !1), $(".drag-and-drop-zone").trigger("reset"), !1;
}
});
var t = function(e, t) {
var n = t.find("label").outerHeight(), a = n ? t.outerHeight() - n : t.outerHeight(), r = t.outerWidth();
e.css({
width: r + 6,
height: a,
position: "absolute",
"z-index": 100
});
};
e.on("putDropZoneFront", function(e, n) {
if (!a.disabled) {
var o, i = r.find(".drag-and-drop-zone");
return n ? (o = a.dropZoneId ? $("#" + a.dropZoneId) : r, t(i, o)) : i.css("z-index", "-1"), !1;
}
}), e.on("reset", function() {
if (!a.disabled) return d = !1, !1;
});
}), $(document).on("drop." + c, function() {
return i(), r.find(".drag-and-drop-zone").trigger("putDropZoneFront", !1), !1;
}), $(document).on("dragenter." + c, function() {
if (!a.disabled) return d = !0, r.find(".drag-and-drop-zone").addClass("show-drag-and-drop-zone"), r.find(".drag-and-drop-zone").trigger("putDropZoneFront", !0), !1;
}), $(document).on("dragover." + c, function() {
if (!a.disabled) return d = !0, r.find(".drag-and-drop-zone").addClass("show-drag-and-drop-zone"), !1;
}), $(document).on("dragleave." + c, function() {
return d = !1, _.delay(function() {
d || r.find(".drag-and-drop-zone").removeClass("show-drag-and-drop-zone");
}, 200), !1;
}), a.cleanInputValues = function() {
a.model = "", a.fileName = "", a.isBinaryFile = !1, m[0].value = "";
}, m.change(function() {
o(m[0].files[0]), m[0].value = "";
}), a.$on("$destroy", function() {
$(l).off(), $(document).off("drop." + c).off("dragenter." + c).off("dragover." + c).off("dragleave." + c);
});
}
};
} ]), angular.module("openshiftConsole").directive("oscFormSection", function() {
return {
restrict: "E",
transclude: !0,
scope: {
header: "@",
about: "@",
aboutTitle: "@",
editText: "@",
expand: "=?",
canToggle: "=?"
},
templateUrl: "views/directives/osc-form-section.html",
link: function(e, t, n) {
n.editText || (n.editText = "Edit"), angular.isDefined(n.canToggle) || (e.canToggle = !0), e.toggle = function() {
e.expand = !e.expand;
};
}
};
}), angular.module("openshiftConsole").directive("oscGitLink", [ "$filter", function(e) {
return {
restrict: "E",
scope: {
uri: "=",
ref: "=",
contextDir: "="
},
transclude: !0,
link: function(t) {
var n = e("isAbsoluteURL"), a = e("githubLink");
t.$watchGroup([ "uri", "ref", "contextDir" ], function() {
t.gitLink = a(t.uri, t.ref, t.contextDir), t.isLink = n(t.gitLink);
});
},
template: '<a ng-if="isLink" ng-href="{{gitLink}}" ng-transclude target="_blank"></a><span ng-if="!isLink" ng-transclude></span>'
};
} ]), angular.module("openshiftConsole").directive("oscImageSummary", function() {
return {
restrict: "E",
scope: {
resource: "=",
name: "=",
tag: "="
},
templateUrl: "views/directives/osc-image-summary.html"
};
}), angular.module("openshiftConsole").directive("oscRouting", [ "$filter", "Constants", "DNS1123_SUBDOMAIN_VALIDATION", function(e, t, n) {
return {
require: "^form",
restrict: "E",
scope: {
route: "=model",
services: "=",
showNameInput: "=",
routingDisabled: "=",
existingRoute: "="
},
templateUrl: "views/directives/osc-routing.html",
link: function(a, r, o, i) {
a.form = i, a.controls = {}, a.options = {
secureRoute: !1,
alternateServices: !1
};
var s = {
group: "route.openshift.io",
resource: "routes/custom-host"
};
a.canICreateCustomHosts = e("canI")(s, "create"), a.canIUpdateCustomHosts = e("canI")(s, "update");
var c = function() {
return a.existingRoute ? a.canIUpdateCustomHosts : a.canICreateCustomHosts;
};
a.isHostnameReadOnly = function() {
return !c();
}, a.disableWildcards = t.DISABLE_WILDCARD_ROUTES || a.existingRoute && "Subdomain" !== a.route.wildcardPolicy, a.areCertificateInputsReadOnly = function() {
return !a.canICreateCustomHosts;
}, a.areCertificateInputsDisabled = function() {
var e = _.get(a, "route.tls.termination");
return !e || "passthrough" === e;
}, a.isDestinationCACertInputDisabled = function() {
return "reencrypt" !== _.get(a, "route.tls.termination");
}, a.insecureTrafficOptions = [ {
value: "",
label: "None"
}, {
value: "Allow",
label: "Allow"
}, {
value: "Redirect",
label: "Redirect"
} ], _.has(a, "route.tls.insecureEdgeTerminationPolicy") || _.set(a, "route.tls.insecureEdgeTerminationPolicy", "");
a.$watchGroup([ "route.tls.termination", "route.tls.insecureEdgeTerminationPolicy" ], function() {
var e = "passthrough" !== _.get(a, "route.tls.termination") || "Allow" !== _.get(a, "route.tls.insecureEdgeTerminationPolicy");
a.routeForm.insecureTraffic.$setValidity("passthrough", e);
}), a.nameValidation = n, a.disableWildcards ? a.hostnamePattern = n.pattern : a.hostnamePattern = /^(\*(\.[a-z0-9]([-a-z0-9]*[a-z0-9]))+|[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*)$/, a.hostnameMaxLength = n.maxlength;
var l = function(e) {
if (e) {
var t = _.get(e, "spec.ports", []);
a.unnamedServicePort = 1 === t.length && !t[0].name, t.length && !a.unnamedServicePort ? a.route.portOptions = _.map(t, function(e) {
return {
port: e.name,
label: e.port + " → " + e.targetPort + " (" + e.protocol + ")"
};
}) : a.route.portOptions = [];
}
};
a.services && !a.route.service && (a.route.service = _.find(a.services)), a.servicesByName, a.services ? a.servicesByName = _.keyBy(a.services, "metadata.name") : a.servicesByName = {}, a.$watch("route.to.name", function(e, t) {
l(a.servicesByName[e]), e === t && a.route.targetPort || (a.route.targetPort = _.get(a, "route.portOptions[0].port")), a.services && (a.alternateServiceOptions = _.reject(a.services, function(t) {
return e === t.metadata.name;
}));
}), a.$watch("route.alternateServices", function(e) {
a.duplicateServices = _(e).map("name").filter(function(e, t, n) {
return _.includes(n, e, t + 1);
}).value(), i.$setValidity("duplicateServices", !a.duplicateServices.length), a.options.alternateServices = !_.isEmpty(e);
}, !0);
var u = function() {
return !!a.route.tls && ((!a.route.tls.termination || "passthrough" === a.route.tls.termination) && (a.route.tls.certificate || a.route.tls.key || a.route.tls.caCertificate || a.route.tls.destinationCACertificate));
};
a.$watch("route.tls.termination", function() {
a.options.secureRoute = !!_.get(a, "route.tls.termination"), a.showCertificatesNotUsedWarning = u();
});
var d;
a.$watch("options.secureRoute", function(e, t) {
if (e !== t) {
var n = _.get(a, "route.tls.termination");
!a.securetRoute && n && (d = n, delete a.route.tls.termination), a.options.secureRoute && !n && _.set(a, "route.tls.termination", d || "edge");
}
}), a.$watch("options.alternateServices", function(e, t) {
e !== t && (e || (a.route.alternateServices = []), e && _.isEmpty(a.route.alternateServices) && a.addAlternateService());
}), a.addAlternateService = function() {
a.route.alternateServices = a.route.alternateServices || [];
var e = _.find(a.services, function(e) {
return e.metadata.name !== a.route.to.service && !_.some(a.route.alternateServices, {
service: e.metadata.name
});
});
_.has(a, "route.to.weight") || _.set(a, "route.to.weight", 1), a.route.alternateServices.push({
service: e.metadata.name,
weight: 1
});
}, a.weightAsPercentage = function(e, t) {
e = e || 0;
var n = _.get(a, "route.to.weight", 0);
if (_.each(a.route.alternateServices, function(e) {
n += _.get(e, "weight", 0);
}), !n) return "";
var r = e / n * 100;
return t ? d3.round(r, 1) + "%" : r;
};
var m = !1;
a.$watch("route.alternateServices.length", function(e) {
if (0 === e && _.has(a, "route.to.weight") && delete a.route.to.weight, 1 === e) {
if (0 === a.route.to.weight && 0 === a.route.alternateServices[0].weight) return void (a.controls.hideSlider = !0);
m = !0, a.controls.rangeSlider = a.weightAsPercentage(a.route.to.weight);
}
}), a.$watch("controls.hideSlider", function(e) {
e || 1 !== _.size(a.route.alternateServices) || (m = !0, a.controls.rangeSlider = a.weightAsPercentage(a.route.to.weight));
}), a.$watch("controls.rangeSlider", function(e, t) {
m ? m = !1 : e !== t && (e = parseInt(e, 10), _.set(a, "route.to.weight", e), _.set(a, "route.alternateServices[0].weight", 100 - e));
});
}
};
} ]).directive("oscRoutingService", function() {
return {
restrict: "E",
scope: {
model: "=",
serviceOptions: "=",
allServices: "=",
isAlternate: "=?",
showWeight: "=?",
warnUnnamedPort: "=?"
},
templateUrl: "views/directives/osc-routing-service.html",
link: function(e, t, n, a) {
e.form = a, e.id = _.uniqueId("osc-routing-service-"), e.$watchGroup([ "model.name", "serviceOptions" ], function() {
if (_.isEmpty(e.serviceOptions)) e.optionsNames = []; else {
var t = _.get(e, "model.name");
e.optionNames = [], e.selectedExists = !1, e.optionNames = _.map(e.serviceOptions, "metadata.name"), t && !e.allServices[t] && e.optionNames.push(t), t || _.set(e, "model.name", _.head(e.optionNames));
}
});
}
};
}), angular.module("openshiftConsole").directive("oscPersistentVolumeClaim", [ "$filter", "APIService", "DataService", "LimitRangesService", "QuotaService", "ModalsService", "DNS1123_SUBDOMAIN_VALIDATION", function(e, t, n, a, r, o, i) {
var s = t.getPreferredVersion("storageclasses"), c = t.getPreferredVersion("limitranges"), l = t.getPreferredVersion("resourcequotas"), u = t.getPreferredVersion("appliedclusterresourcequotas");
return {
restrict: "E",
scope: {
claim: "=model",
projectName: "="
},
templateUrl: "views/directives/osc-persistent-volume-claim.html",
link: function(t) {
var d = e("amountAndUnit"), m = e("storageClassAccessMode"), p = e("usageValue");
t.nameValidation = i, t.storageClasses = [], t.defaultStorageClass = "", t.claim.accessModes = "ReadWriteOnce", t.claim.unit = "Gi", t.units = [ {
value: "Mi",
label: "MiB"
}, {
value: "Gi",
label: "GiB"
}, {
value: "Ti",
label: "TiB"
}, {
value: "M",
label: "MB"
}, {
value: "G",
label: "GB"
}, {
value: "T",
label: "TB"
} ], t.claim.selectedLabels = [];
var g = [];
t.$watch("useLabels", function(e, n) {
e !== n && (e ? t.claim.selectedLabels = g : (g = t.claim.selectedLabels, t.claim.selectedLabels = []));
}), t.groupUnits = function(e) {
switch (e.value) {
case "Mi":
case "Gi":
case "Ti":
return "Binary Units";

case "M":
case "G":
case "T":
return "Decimal Units";
}
return "";
}, t.showComputeUnitsHelp = function() {
o.showComputeUnitsHelp();
}, t.onStorageClassSelected = function(e) {
var n = m(e);
n && (t.claim.accessModes = n);
};
var f = function() {
var e = t.claim.amount && p(t.claim.amount + t.claim.unit), n = _.has(t, "limits.min") && p(t.limits.min), a = _.has(t, "limits.max") && p(t.limits.max), r = !0, o = !0;
e && n && (r = e >= n), e && a && (o = e <= a), t.persistentVolumeClaimForm.capacity.$setValidity("limitRangeMin", r), t.persistentVolumeClaimForm.capacity.$setValidity("limitRangeMax", o);
}, h = function() {
var e = r.isAnyStorageQuotaExceeded(t.quotas, t.clusterQuotas), n = r.willRequestExceedQuota(t.quotas, t.clusterQuotas, "requests.storage", t.claim.amount + t.claim.unit);
t.persistentVolumeClaimForm.capacity.$setValidity("willExceedStorage", !n), t.persistentVolumeClaimForm.capacity.$setValidity("outOfClaims", !e);
};
n.list(s, {}, function(n) {
var a = n.by("metadata.name");
if (!_.isEmpty(a)) {
t.storageClasses = _.sortBy(a, "metadata.name");
var r = e("annotation");
if (t.defaultStorageClass = _.find(t.storageClasses, function(e) {
return "true" === r(e, "storageclass.beta.kubernetes.io/is-default-class");
}), t.defaultStorageClass) t.claim.storageClass = t.defaultStorageClass; else {
var o = {
metadata: {
name: "No Storage Class",
labels: {},
annotations: {
description: "No storage class will be assigned"
}
}
};
t.storageClasses.unshift(o);
}
}
}, {
errorNotification: !1
}), n.list(c, {
namespace: t.projectName
}, function(e) {
var n = e.by("metadata.name");
if (!_.isEmpty(n)) {
t.limits = a.getEffectiveLimitRange(n, "storage", "PersistentVolumeClaim");
var r;
t.limits.min && t.limits.max && p(t.limits.min) === p(t.limits.max) && (r = d(t.limits.max), t.claim.amount = Number(r[0]), t.claim.unit = r[1], t.capacityReadOnly = !0), t.$watchGroup([ "claim.amount", "claim.unit" ], f);
}
}), n.list(l, {
namespace: t.projectName
}, function(e) {
t.quotas = e.by("metadata.name"), t.$watchGroup([ "claim.amount", "claim.unit" ], h);
}), n.list(u, {
namespace: t.projectName
}, function(e) {
t.clusterQuotas = e.by("metadata.name");
});
}
};
} ]), angular.module("openshiftConsole").directive("oscAutoscaling", [ "Constants", "HPAService", "DNS1123_SUBDOMAIN_VALIDATION", function(e, t, n) {
return {
restrict: "E",
scope: {
autoscaling: "=model",
showNameInput: "=?",
nameReadOnly: "=?",
showRequestInput: "&"
},
templateUrl: "views/directives/osc-autoscaling.html",
link: function(t, a, r) {
t.nameValidation = n;
var o = e.DEFAULT_HPA_CPU_TARGET_PERCENT, i = _.get(t, "autoscaling.targetCPU");
_.isNil(i) && o && _.set(t, "autoscaling.targetCPU", o), "showRequestInput" in r || (t.showRequestInput = !0);
}
};
} ]), angular.module("openshiftConsole").directive("oscSecrets", [ "$uibModal", "$filter", "APIService", "DataService", "SecretsService", function(e, t, n, a, r) {
return {
restrict: "E",
scope: {
pickedSecrets: "=model",
secretsByType: "=",
namespace: "=",
displayType: "@",
type: "@",
alerts: "=",
disableInput: "=",
serviceAccountToLink: "@?",
allowMultipleSecrets: "=?"
},
templateUrl: "views/directives/osc-secrets.html",
link: function(t) {
t.secretsVersion = n.getPreferredVersion("secrets"), t.canAddSourceSecret = function() {
if (!t.allowMultipleSecrets) return !1;
var e = _.last(t.pickedSecrets);
return !!e && e.name;
}, t.setLastSecretsName = function(e) {
_.last(t.pickedSecrets).name = e;
}, t.addSourceSecret = function() {
t.pickedSecrets.push({
name: ""
});
}, t.removeSecret = function(e) {
1 === t.pickedSecrets.length ? t.pickedSecrets = [ {
name: ""
} ] : t.pickedSecrets.splice(e, 1), t.secretsForm.$setDirty();
}, t.openCreateSecretModal = function() {
t.newSecret = {}, e.open({
templateUrl: "views/modals/create-secret.html",
controller: "CreateSecretModalController",
scope: t
}).result.then(function(e) {
a.list(t.secretsVersion, {
namespace: t.namespace
}, function(n) {
var a = r.groupSecretsByType(n), o = _.mapValues(a, function(e) {
return _.map(e, "metadata.name");
});
t.secretsByType = _.each(o, function(e) {
e.unshift("");
}), t.setLastSecretsName(e.metadata.name), t.secretsForm.$setDirty();
});
});
};
}
};
} ]), angular.module("openshiftConsole").directive("oscSourceSecrets", [ "$uibModal", "$filter", "APIService", "DataService", "SecretsService", function(e, t, n, a, r) {
return {
restrict: "E",
scope: {
pickedSecrets: "=model",
secretsByType: "=",
strategyType: "=",
type: "@",
displayType: "@",
namespace: "=",
alerts: "=",
serviceAccountToLink: "@?"
},
templateUrl: "views/directives/osc-source-secrets.html",
link: function(t) {
t.secretsVersion = n.getPreferredVersion("secrets"), t.canAddSourceSecret = function() {
var e = _.last(t.pickedSecrets);
switch (t.strategyType) {
case "Custom":
return _.get(e, "secretSource.name");

default:
return _.get(e, "secret.name");
}
}, t.setLastSecretsName = function(e) {
var n = _.last(t.pickedSecrets);
switch (t.strategyType) {
case "Custom":
return void (n.secretSource.name = e);

default:
return void (n.secret.name = e);
}
}, t.addSourceSecret = function() {
switch (t.strategyType) {
case "Custom":
return void t.pickedSecrets.push({
secretSource: {
name: ""
},
mountPath: ""
});

default:
return void t.pickedSecrets.push({
secret: {
name: ""
},
destinationDir: ""
});
}
}, t.removeSecret = function(e) {
if (1 === t.pickedSecrets.length) switch (t.strategyType) {
case "Custom":
t.pickedSecrets = [ {
secretSource: {
name: ""
},
mountPath: ""
} ];
break;

default:
t.pickedSecrets = [ {
secret: {
name: ""
},
destinationDir: ""
} ];
} else t.pickedSecrets.splice(e, 1);
t.secretsForm.$setDirty();
}, t.openCreateSecretModal = function() {
e.open({
templateUrl: "views/modals/create-secret.html",
controller: "CreateSecretModalController",
scope: t
}).result.then(function(e) {
a.list(t.secretsVersion, {
namespace: t.namespace
}, function(n) {
var a = r.groupSecretsByType(n), o = _.mapValues(a, function(e) {
return _.map(e, "metadata.name");
});
t.secretsByType = _.each(o, function(e) {
e.unshift("");
}), t.setLastSecretsName(e.metadata.name);
});
});
};
}
};
} ]), angular.module("openshiftConsole").directive("replicas", function() {
return {
restrict: "E",
scope: {
status: "=?",
spec: "=",
disableScaling: "=?",
scaleFn: "&?",
deployment: "="
},
templateUrl: "views/directives/replicas.html",
link: function(e) {
e.model = {
editing: !1
}, e.scale = function() {
e.form.scaling.$valid && (e.scaleFn({
replicas: e.model.desired
}), e.model.editing = !1);
}, e.cancel = function() {
e.model.editing = !1;
};
}
};
}), angular.module("openshiftConsole").directive("containerStatuses", [ "$filter", "APIService", function(e, t) {
return {
restrict: "E",
scope: {
pod: "=",
onDebugTerminal: "=?",
detailed: "=?"
},
templateUrl: "views/_container-statuses.html",
link: function(n) {
n.hasDebugTerminal = angular.isFunction(n.onDebugTerminal), n.podsVersion = t.getPreferredVersion("pods");
var a = e("isContainerTerminatedSuccessfully"), r = function(e) {
return _.every(e, a);
};
n.$watch("pod", function(e) {
n.initContainersTerminated = r(e.status.initContainerStatuses), !1 !== n.expandInitContainers && (n.expandInitContainers = !n.initContainersTerminated);
}), n.toggleInitContainer = function() {
n.expandInitContainers = !n.expandInitContainers;
}, n.showDebugAction = function(t) {
if ("Completed" === _.get(n.pod, "status.phase")) return !1;
if (e("annotation")(n.pod, "openshift.io/build.name")) return !1;
if (e("isDebugPod")(n.pod)) return !1;
var a = _.get(t, "state.waiting.reason");
return "ImagePullBackOff" !== a && "ErrImagePull" !== a && (!_.get(t, "state.running") || !t.ready);
}, n.debugTerminal = function(e) {
if (n.hasDebugTerminal) return n.onDebugTerminal.call(this, e);
};
}
};
} ]).directive("podTemplate", function() {
return {
restrict: "E",
scope: {
podTemplate: "=",
imagesByDockerReference: "=",
builds: "=",
detailed: "=?",
addHealthCheckUrl: "@?"
},
templateUrl: "views/_pod-template.html"
};
}).directive("podTemplateContainer", function() {
return {
restrict: "E",
scope: {
container: "=podTemplateContainer",
imagesByDockerReference: "=",
builds: "=",
detailed: "=?"
},
templateUrl: "views/_pod-template-container.html"
};
}).directive("annotations", function() {
return {
restrict: "E",
scope: {
annotations: "="
},
templateUrl: "views/directives/annotations.html",
link: function(e) {
e.expandAnnotations = !1, e.toggleAnnotations = function() {
e.expandAnnotations = !e.expandAnnotations;
};
}
};
}).directive("registryAnnotations", function() {
return {
restrict: "E",
priority: 1,
terminal: !0,
scope: {
annotations: "="
},
templateUrl: "views/directives/annotations.html",
link: function(e) {
e.expandAnnotations = !1, e.toggleAnnotations = function() {
e.expandAnnotations = !e.expandAnnotations;
};
}
};
}).directive("volumes", [ "APIService", function(e) {
return {
restrict: "E",
scope: {
volumes: "=",
namespace: "=",
canRemove: "=?",
removeFn: "&?"
},
templateUrl: "views/_volumes.html",
link: function(t) {
t.secretsVersion = e.getPreferredVersion("secrets");
}
};
} ]).directive("volumeClaimTemplates", function() {
return {
restrict: "E",
scope: {
templates: "="
},
templateUrl: "views/_volume-claim-templates.html"
};
}).directive("hpa", function() {
return {
restrict: "E",
scope: {
hpa: "=",
project: "=",
showScaleTarget: "=?",
alerts: "="
},
templateUrl: "views/directives/hpa.html"
};
}).directive("probe", function() {
return {
restrict: "E",
scope: {
probe: "="
},
templateUrl: "views/directives/_probe.html"
};
}).directive("podsTable", [ "$filter", function(e) {
return {
restrict: "E",
scope: {
pods: "=",
activePods: "=?",
emptyMessage: "=?",
customNameHeader: "=?",
podFailureReasons: "=?"
},
templateUrl: "views/directives/pods-table.html",
link: function(t) {
var n = e("orderObjectsByDate"), a = _.debounce(function(e) {
t.$evalAsync(function() {
t.sortedPods = n(e, !0);
});
}, 150, {
maxWait: 500
});
t.$watch("pods", a);
}
};
} ]).directive("trafficTable", function() {
return {
restrict: "E",
scope: {
routes: "=",
services: "=",
portsByRoute: "=",
showNodePorts: "=?",
customNameHeader: "=?"
},
templateUrl: "views/directives/traffic-table.html"
};
}), angular.module("openshiftConsole").component("resourceServiceBindings", {
controller: [ "$filter", "APIService", "BindingService", "CatalogService", "DataService", ResourceServiceBindings ],
controllerAs: "$ctrl",
bindings: {
project: "<",
projectContext: "<",
apiObject: "<",
createBinding: "&"
},
templateUrl: "views/directives/resource-service-bindings.html"
}), angular.module("openshiftConsole").component("serviceInstanceBindings", {
controller: [ "$filter", "APIService", "BindingService", ServiceInstanceBindings ],
controllerAs: "$ctrl",
bindings: {
isOverview: "<?",
showHeader: "<?",
project: "<",
bindings: "<",
serviceInstance: "<",
serviceClass: "<",
servicePlan: "<"
},
templateUrl: "views/directives/service-instance-bindings.html"
}), angular.module("openshiftConsole").directive("sidebar", [ "$location", "$filter", "$timeout", "$rootScope", "$routeParams", "APIService", "AuthorizationService", "Constants", "HTMLService", function(e, t, n, a, r, o, i, s, c) {
var l = function(e, t) {
return e.href === t || _.some(e.prefixes, function(e) {
return _.startsWith(t, e);
});
};
return {
restrict: "E",
templateUrl: "views/_sidebar.html",
controller: [ "$scope", "gettext", function(u, d) {
var m;
u.navItems = s.PROJECT_NAVIGATION(d), u.sidebar = {};
var p = function() {
u.projectName = r.project, _.set(u, "sidebar.secondaryOpen", !1), _.set(a, "nav.showMobileNav", !1), u.activeSecondary = null, u.activePrimary = _.find(u.navItems, function(t) {
return m = e.path().replace("/project/" + u.projectName, ""), l(t, m) ? (u.activeSecondary = null, !0) : _.some(t.secondaryNavSections, function(e) {
var t = _.find(e.items, function(e) {
return l(e, m);
});
return !!t && (u.activeSecondary = t, !0);
});
});
};
p(), u.$on("$routeChangeSuccess", p);
var g = function() {
_.each(u.navItems, function(e) {
e.isHover = !1;
});
};
u.navURL = function(e) {
return e ? t("isAbsoluteURL")(e) ? e : "project/" + u.projectName + e : "";
}, u.show = function(e) {
if (!(!e.isValid || e.isValid())) return !1;
if (!e.canI) return !0;
if (e.canI.addToProject) return u.canIAddToProject;
var t = _.pick(e.canI, [ "resource", "group", "version" ]);
return o.apiInfo(t) && i.canI(t, e.canI.verb, u.projectName);
}, u.itemClicked = function(e) {
if (g(), e.href) return u.nav.showMobileNav = !1, void (u.sidebar.secondaryOpen = !1);
e.isHover = !0, e.mobileSecondary = u.isMobile, u.sidebar.showMobileSecondary = u.isMobile, u.sidebar.secondaryOpen = !0;
}, u.onMouseEnter = function(e) {
e.mouseLeaveTimeout && (n.cancel(e.mouseLeaveTimeout), e.mouseLeaveTimeout = null), e.mouseEnterTimeout = n(function() {
e.isHover = !0, e.mouseEnterTimeout = null, u.sidebar.secondaryOpen = !_.isEmpty(e.secondaryNavSections);
}, 200);
}, u.onMouseLeave = function(e) {
e.mouseEnterTimeout && (n.cancel(e.mouseEnterTimeout), e.mouseEnterTimeout = null), e.mouseLeaveTimeout = n(function() {
e.isHover = !1, e.mouseLeaveTimeout = null, u.sidebar.secondaryOpen = _.some(u.navItems, function(e) {
return e.isHover && !_.isEmpty(e.secondaryNavSections);
});
}, 300);
}, u.closeNav = function() {
g(), u.nav.showMobileNav = !1, u.sidebar.secondaryOpen = !1;
}, u.collapseMobileSecondary = function(e, t) {
e.mobileSecondary = !1, t.stopPropagation();
};
var f = function() {
return c.isWindowBelowBreakpoint(c.WINDOW_SIZE_SM);
};
u.isMobile = f();
var h = _.throttle(function() {
var e = f();
e !== u.isMobile && u.$evalAsync(function() {
u.isMobile = e, e || (_.set(a, "nav.showMobileNav", !1), _.each(u.navItems, function(e) {
e.mobileSecondary = !1;
}));
});
}, 50);
$(window).on("resize.verticalnav", h), u.$on("$destroy", function() {
$(window).off(".verticalnav");
});
} ]
};
} ]).directive("oscHeader", [ "$filter", "$location", "$q", "$rootScope", "$routeParams", "$timeout", "APIService", "AuthorizationService", "Catalog", "CatalogService", "Constants", "DataService", "Navigate", "NotificationsService", "ProjectsService", "projectOverviewURLFilter", "RecentlyViewedServiceItems", function(e, t, n, a, r, o, i, s, c, l, u, d, m, p, g, f, h) {
var v = {}, y = [], b = e("displayName"), S = e("uniqueDisplayName"), C = i.getPreferredVersion("templates");
return {
restrict: "EA",
templateUrl: "views/directives/header/header.html",
link: function(i, p) {
i.currentProject = v[r.project];
var w = function(e, t) {
var n;
_.set(a, "nav.collapsed", e), t && (n = e ? "true" : "false", localStorage.setItem("openshift/vertical-nav-collapsed", n));
};
!function() {
var e = "true" === localStorage.getItem("openshift/vertical-nav-collapsed");
w(e);
}();
var P = function() {
return _.get(a, "nav.collapsed", !1);
}, k = function(e) {
_.set(a, "nav.showMobileNav", e);
}, j = function(e) {
"/catalog" === t.path() ? e.selectpicker("val", "catalog") : e.selectpicker("val", "application-console");
}, R = function(e) {
i.$evalAsync(function() {
t.url(e);
});
};
i.toggleNav = function() {
var e = P();
w(!e, !0), a.$emit("oscHeader.toggleNav");
}, i.toggleMobileNav = function() {
var e = _.get(a, "nav.showMobileNav");
k(!e);
}, i.closeMobileNav = function() {
k(!1);
}, i.closeOrderingPanel = function() {
i.orderingPanelVisible = !1;
}, i.showOrderingPanel = function(e) {
i.orderingPanelVisible = !0, i.orderKind = e;
}, i.onSearchToggle = function(e) {
_.set(a, "view.hasProjectSearch", e);
}, i.catalogLandingPageEnabled = !u.DISABLE_SERVICE_CATALOG_LANDING_PAGE;
var I = p.find(".contextselector");
i.clusterConsoleURL = window.OPENSHIFT_CONFIG.adminConsoleURL, I.on("loaded.bs.select", function() {
j(I);
}).change(function() {
switch ($(this).val()) {
case "catalog":
R("/catalog");
break;

case "application-console":
R("/projects");
break;

case "cluster-console":
window.location.assign(i.clusterConsoleURL);
}
});
var T = p.find(".project-picker"), N = [], A = function() {
var t = i.currentProjectName;
if (t) {
var n = function(e, n) {
var a = $("<option>").attr("value", e.metadata.name).attr("selected", e.metadata.name === t);
return n ? a.text(b(e)) : a.text(S(e, y)), a;
};
_.size(v) <= 100 ? (y = e("orderByDisplayName")(v), N = _.map(y, function(e) {
return n(e, !1);
})) : N = [ n(v[t], !0) ], T.empty(), T.append(N), T.append($('<option data-divider="true"></option>')), T.append($('<option value="">View All Projects</option>')), T.selectpicker("refresh");
}
}, E = function() {
return g.list().then(function(e) {
v = e.by("metadata.name");
});
}, D = function() {
j(I);
var e = r.project;
if (i.currentProjectName !== e) {
i.currentProjectName = e, i.chromeless = "chromeless" === r.view;
var t, o;
e && !i.chromeless ? (_.set(a, "view.hasProject", !0), i.canIAddToProject = !1, s.getProjectRules(e).then(function() {
if (i.currentProjectName === e && (i.canIAddToProject = s.canIAddToProject(e), i.canIAddToProject)) {
var a = l.getCatalogItems().then(function(e) {
t = e;
}), r = c.getProjectCatalogItems(e).then(_.spread(function(e) {
o = e;
}));
n.all([ a, r ]).then(function() {
i.catalogItems = c.sortCatalogItems(_.concat(t, o));
});
}
}), E().then(function() {
i.currentProjectName && v && (v[i.currentProjectName] || (v[i.currentProjectName] = {
metadata: {
name: i.currentProjectName
}
}), i.currentProject = v[i.currentProjectName], A());
})) : _.set(a, "view.hasProject", !1);
}
}, B = function() {
i.orderingPanelVisible && h.addItem(_.get(i.selectedItem, "resource.metadata.uid"));
}, L = function(e) {
return "PartialObjectMetadata" === e.kind;
}, V = function(e) {
return L(e) ? d.get(C, e.metadata.name, {
namespace: e.metadata.namespace
}) : n.when(e);
};
i.$on("open-overlay-panel", function(e, t) {
i.currentProjectName && (i.servicePlansForItem = null, i.orderKind = _.get(t, "kind"), "Template" !== i.orderKind ? "ClusterServiceClass" !== i.orderKind ? o(function() {
i.selectedItem = t, i.orderingPanelVisible = !0;
}) : c.getServicePlansForServiceClass(_.get(t, "resource.metadata.name")).then(function(e) {
i.servicePlansForItem = _.reject(e.by("metadata.name"), {
status: {
removedFromBrokerCatalog: !0
}
}), i.selectedItem = t, i.orderingPanelVisible = !0;
}) : V(t.resource).then(function(e) {
i.selectedItem = e, i.orderingPanelVisible = !0, i.orderKind = "Template";
}));
});
var U = a.$on("filter-catalog-items", function(e, t) {
if (i.currentProjectName) {
var n = {
filter: t.searchText
};
m.toProjectCatalog(i.currentProjectName, n);
}
});
i.closeOrderingPanel = function() {
h.addItem(_.get(i.selectedItem, "resource.metadata.uid")), i.orderingPanelVisible = !1;
}, D(), i.$on("$routeChangeSuccess", D), T.change(function() {
var e = $(this).val(), t = "" === e ? "projects" : f(e);
R(t);
}), i.$on("$destroy", function() {
U(), B();
});
}
};
} ]).directive("projectFilter", [ "LabelFilter", function(e) {
return {
restrict: "E",
templateUrl: "views/directives/_project-filter.html",
link: function(t, n) {
e.setupFilterWidget(n.find(".navbar-filter-widget"), n.find(".active-filters"), {
addButtonText: "Add"
}), e.toggleFilterWidget(!t.renderOptions || !t.renderOptions.hideFilterWidget), t.$watch("renderOptions", function(t) {
e.toggleFilterWidget(!t || !t.hideFilterWidget);
});
}
};
} ]).directive("navbarUtility", function() {
return {
restrict: "E",
transclude: !0,
templateUrl: "views/directives/header/_navbar-utility.html",
controller: [ "$scope", "Constants", function(e, t) {
e.launcherApps = t.APP_LAUNCHER_NAVIGATION;
} ]
};
}).directive("navbarUtilityMobile", [ "$timeout", function(e) {
return {
restrict: "E",
transclude: !0,
templateUrl: "views/directives/header/_navbar-utility-mobile.html",
link: function(t, n) {
e(function() {
var e = n.find("li");
e.addClass("list-group-item");
var a = {};
e.each(function(e, t) {
var n = $(t).find("a");
n.each(function(e, n) {
n.href && (a[n.href] = t);
}), n.contents().filter(function() {
return 3 === this.nodeType && $.trim(this.nodeValue).length;
}).wrap('<span class="list-group-item-value"/>');
});
var r = function() {
e.removeClass("active");
var t = a[window.location.href];
t && $(t).addClass("active");
};
r(), t.$on("$routeChangeSuccess", r);
});
}
};
} ]).directive("navPfVerticalAlt", function() {
return {
restrict: "EAC",
link: function() {
$.fn.navigation();
}
};
}).directive("breadcrumbs", function() {
return {
restrict: "E",
scope: {
breadcrumbs: "="
},
templateUrl: "views/directives/breadcrumbs.html"
};
}).directive("back", [ "$window", function(e) {
return {
restrict: "A",
link: function(t, n) {
n.bind("click", function() {
e.history.back();
});
}
};
} ]), angular.module("openshiftConsole").component("alerts", {
bindings: {
alerts: "=",
filter: "<?",
hideCloseButton: "<?"
},
templateUrl: "components/alerts/alerts.html",
controller: function() {
var e = this;
e.close = function(e) {
e.hidden = !0, _.isFunction(e.onClose) && e.onClose();
}, e.onClick = function(t, n) {
_.isFunction(n.onClick) && n.onClick() && e.close(t);
};
}
}), function() {
angular.module("openshiftConsole").component("istagSelect", {
controller: [ "$scope", "APIService", "DataService", "ProjectsService", function(e, t, n, a) {
var r = this, o = t.getPreferredVersion("imagestreams");
r.isByNamespace = {}, r.isNamesByNamespace = {};
var i = _.get(r, "istag.namespace") && _.get(r, "istag.imageStream") && _.get(r, "istag.tagObject.tag"), s = function(e) {
_.each(e, function(e) {
_.get(e, "status.tags") || _.set(e, "status.tags", []);
});
}, c = function(e) {
if (r.isByNamespace[e] = {}, r.isNamesByNamespace[e] = [], !_.includes(r.namespaces, e)) return r.namespaces.push(e), r.isNamesByNamespace[e] = r.isNamesByNamespace[e].concat(r.istag.imageStream), void (r.isByNamespace[e][r.istag.imageStream] = {
status: {
tags: [ {
tag: r.istag.tagObject.tag
} ]
}
});
n.list(o, {
namespace: e
}, function(t) {
var n = angular.copy(t.by("metadata.name"));
s(n), r.isByNamespace[e] = n, r.isNamesByNamespace[e] = _.keys(n).sort(), _.includes(r.isNamesByNamespace[e], r.istag.imageStream) || (r.isNamesByNamespace[e] = r.isNamesByNamespace[e].concat(r.istag.imageStream), r.isByNamespace[e][r.istag.imageStream] = {
status: {
tags: {}
}
}), _.find(r.isByNamespace[e][r.istag.imageStream].status.tags, {
tag: r.istag.tagObject.tag
}) || r.isByNamespace[e][r.istag.imageStream].status.tags.push({
tag: r.istag.tagObject.tag
});
});
};
a.list().then(function(e) {
r.namespaces = _.keys(e.by("metadata.name")), r.includeSharedNamespace && (r.namespaces = _.uniq([ "openshift" ].concat(r.namespaces))), r.namespaces = r.namespaces.sort(), r.namespaceChanged(r.istag.namespace);
}), r.namespaceChanged = function(e) {
if (i || (r.istag.imageStream = null, r.istag.tagObject = null), e && !r.isByNamespace[e]) return i ? (c(e), void (i = !1)) : void n.list(o, {
namespace: e
}, function(t) {
var n = angular.copy(t.by("metadata.name"));
s(n), r.isByNamespace[e] = n, r.isNamesByNamespace[e] = _.keys(n).sort();
});
}, r.getTags = function(e) {
r.allowCustomTag && e && !_.find(r.isByNamespace[r.istag.namespace][r.istag.imageStream].status.tags, {
tag: e
}) && (_.remove(r.isByNamespace[r.istag.namespace][r.istag.imageStream].status.tags, function(e) {
return !e.items;
}), r.isByNamespace[r.istag.namespace][r.istag.imageStream].status.tags.unshift({
tag: e
}));
}, r.groupTags = function(e) {
return r.allowCustomTag ? e.items ? "Current Tags" : "New Tag" : "";
};
} ],
controllerAs: "$ctrl",
bindings: {
istag: "=model",
selectDisabled: "<",
selectRequired: "<",
includeSharedNamespace: "<",
allowCustomTag: "<",
appendToBody: "<"
},
require: {
parent: "^form"
},
templateUrl: "components/istag-select/istag-select.html"
});
}(), function() {
angular.module("openshiftConsole").component("oscWebhookTriggers", {
controller: [ "$filter", "$scope", "$timeout", "$uibModal", "APIService", function(e, t, n, a, r) {
var o = this;
o.isDeprecated = function(t) {
var n = e("getWebhookSecretData")(t);
return _.has(n, "secret") && !_.has(n, "secretReference.name");
}, o.addEmptyWebhookTrigger = function() {
o.webhookTriggers.push({
lastTriggerType: "",
data: {
type: ""
}
});
var e = o.webhookTriggers.length - 1;
n(function() {
t.$broadcast("focus-index-" + e);
});
};
var i = function(e) {
var t = _.get(e, "data.type");
if (t && !_.isNil(e.data[t.toLowerCase()])) {
var n = _.filter(o.webhookTriggers, function(t) {
return _.isEqual(t.data, e.data);
});
_.each(n, function(e, t) {
var n = 0 === t;
e.isDuplicate = !n;
});
}
}, s = function() {
_.isEmpty(o.webhookTriggers) ? o.addEmptyWebhookTrigger() : _.each(o.webhookTriggers, function(e) {
o.isDeprecated(e) && (e.secretInputType = "password"), e.isDuplicate || i(e);
});
};
o.$onInit = function() {
t.namespace = o.namespace, t.type = o.type, o.secretsVersion = r.getPreferredVersion("secrets"), o.webhookTypesOptions = [ {
type: "github",
label: "GitHub"
}, {
type: "gitlab",
label: "GitLab"
}, {
type: "bitbucket",
label: "Bitbucket"
}, {
type: "generic",
label: "Generic"
} ], s();
}, o.toggleSecretInputType = function(e) {
e.secretInputType = "password" === e.secretInputType ? "text" : "password";
}, o.removeWebhookTrigger = function(e, t) {
var n = _.clone(e);
if (1 === o.webhookTriggers.length) {
var a = _.first(o.webhookTriggers);
a.lastTriggerType = "", a.data = {
type: ""
};
} else o.webhookTriggers.splice(t, 1);
o.form.$setDirty(), i(n);
}, o.triggerTypeChange = function(e) {
var t = _.toLower(e.lastTriggerType), n = _.toLower(e.data.type);
e.data[n] = e.data[t], delete e.data[t], e.lastTriggerType = e.data.type, i(e);
}, o.triggerSecretChange = function(e) {
i(e);
}, o.openCreateWebhookSecretModal = function() {
a.open({
templateUrl: "views/modals/create-secret.html",
controller: "CreateSecretModalController",
scope: t
}).result.then(function(e) {
o.webhookSecrets.push(e);
});
};
} ],
controllerAs: "$ctrl",
bindings: {
webhookSecrets: "<",
namespace: "<",
type: "@",
webhookTriggers: "=",
form: "="
},
templateUrl: "components/osc-webhook-triggers/osc-webhook-triggers.html"
});
}(), angular.module("openshiftConsole").directive("parseError", function() {
return {
restrict: "E",
scope: {
error: "="
},
templateUrl: "views/_parse-error.html",
link: function(e) {
e.$watch("error", function() {
e.hidden = !1;
});
}
};
}), angular.module("openshiftConsole").directive("podWarnings", [ "podWarningsFilter", function(e) {
return {
restrict: "E",
scope: {
pod: "="
},
link: function(t) {
var n, a = "", r = e(t.pod);
for (n = 0; n < _.size(r); n++) a && (a += "<br>"), "error" === r[n].severity && (t.hasError = !0), a += r[n].message;
t.content = a;
},
templateUrl: "views/directives/_warnings-popover.html"
};
} ]).directive("routeWarnings", [ "RoutesService", function(e) {
return {
restrict: "E",
scope: {
route: "=",
services: "="
},
link: function(t) {
t.$watchGroup([ "route", "services" ], function() {
var n = e.getRouteWarnings(t.route, t.services);
t.content = _.map(n, _.escape).join("<br>");
});
},
templateUrl: "views/directives/_warnings-popover.html"
};
} ]), angular.module("openshiftConsole").directive("takeFocus", [ "$timeout", function(e) {
return {
restrict: "A",
link: function(t, n) {
e(function() {
$(n).focus();
}, 300);
}
};
} ]).directive("selectOnFocus", function() {
return {
restrict: "A",
link: function(e, t) {
$(t).focus(function() {
$(this).select();
});
}
};
}).directive("focusWhen", [ "$timeout", function(e) {
return {
restrict: "A",
scope: {
trigger: "@focusWhen"
},
link: function(t, n) {
t.$watch("trigger", function(t) {
t && e(function() {
$(n).focus();
});
});
}
};
} ]).directive("clickToReveal", function() {
return {
restrict: "A",
transclude: !0,
scope: {
linkText: "@"
},
templateUrl: "views/directives/_click-to-reveal.html",
link: function(e, t) {
$(".reveal-contents-link", t).click(function() {
$(this).hide(), $(".reveal-contents", t).show();
});
}
};
}).directive("copyToClipboard", function() {
return {
restrict: "E",
scope: {
clipboardText: "=",
isDisabled: "=?",
displayWide: "=?",
inputText: "=?",
multiline: "=?"
},
templateUrl: "views/directives/_copy-to-clipboard.html",
controller: [ "$scope", function(e) {
e.id = _.uniqueId("clipboardJs");
} ],
link: function(e, t) {
var n = $("a", t), a = n.get(0);
e.inputText && (a = n.get(1));
var r = new Clipboard(a);
r.on("success", function(e) {
$(e.trigger).attr("title", "Copied!").tooltip("fixTitle").tooltip("show").attr("title", "Copy to Clipboard").tooltip("fixTitle"), e.clearSelection();
}), r.on("error", function(e) {
var t = /Mac/i.test(navigator.userAgent) ? "Press ⌘C to copy" : "Press Ctrl-C to copy";
$(e.trigger).attr("title", t).tooltip("fixTitle").tooltip("show").attr("title", "Copy to Clipboard").tooltip("fixTitle");
}), t.on("$destroy", function() {
r.destroy();
});
}
};
}).directive("copyLoginToClipboard", [ "NotificationsService", function(e) {
return {
restrict: "E",
replace: !0,
scope: {
clipboardText: "@"
},
template: '<a href="" data-clipboard-text="">Copy Login Command</a>',
link: function(t, n) {
var a = new Clipboard(n.get(0));
a.on("success", function() {
e.addNotification({
id: "copy-login-command-success",
type: "success",
message: "Login command copied."
});
e.addNotification({
id: "openshift/token-warning",
type: "warning",
message: "A token is a form of a password. Do not share your API token.",
links: [ {
href: "",
label: "Don't Show Me Again",
onClick: function() {
return e.permanentlyHideNotification("openshift/token-warning"), !0;
}
} ]
});
}), a.on("error", function() {
e.addNotification({
id: "copy-login-command-error",
type: "error",
message: "Unable to copy the login command."
});
}), n.on("$destroy", function() {
a.destroy();
});
}
};
} ]).directive("setHomePage", [ "$uibModal", function(e) {
return {
restrict: "E",
replace: !0,
template: '<a href="">Set Home Page</a>',
link: function(t, n) {
n.bind("click", function() {
e.open({
templateUrl: "views/modals/set-home-page-modal.html",
controller: "SetHomePageModalController"
});
});
}
};
} ]).directive("shortId", function() {
return {
restrict: "E",
scope: {
id: "@"
},
template: '<code class="short-id" title="{{id}}">{{id.substring(0, 6)}}</code>'
};
}).directive("customIcon", [ "$filter", function(e) {
return {
restrict: "E",
scope: {
resource: "=",
kind: "@",
tag: "=?"
},
controller: [ "$scope", function(t) {
t.$watchGroup([ "resource", "tag" ], function() {
t.tag ? t.icon = e("imageStreamTagAnnotation")(t.resource, "icon", t.tag) : t.icon = e("annotation")(t.resource, "icon"), t.icon && 0 === t.icon.indexOf("data:") ? t.image = t.icon : (t.tag ? t.icon = e("imageStreamTagIconClass")(t.resource, t.tag) : t.icon = e("iconClass")(t.resource, t.kind), t.image = e("imageForIconClass")(t.icon));
});
} ],
templateUrl: "views/directives/_custom-icon.html"
};
} ]).directive("bottomOfWindow", function() {
return {
restrict: "A",
link: function(e, t) {
function n() {
var e = $(window).height() - t[0].getBoundingClientRect().top;
t.css("height", e - 10 + "px");
}
$(window).on("resize", n), n(), t.on("$destroy", function() {
$(window).off("resize", n);
});
}
};
}).directive("onEnter", function() {
return function(e, t, n) {
t.bind("keydown keypress", function(t) {
13 === t.which && (e.$apply(function() {
e.$eval(n.onEnter);
}), t.preventDefault());
});
};
}).directive("onEsc", function() {
return function(e, t, n) {
t.bind("keydown keypress", function(t) {
27 === t.which && (e.$apply(function() {
e.$eval(n.onEsc);
}), t.preventDefault());
});
};
}).directive("persistTabState", [ "$routeParams", "$location", function(e, t) {
return {
restrict: "A",
scope: !1,
link: function(n) {
n.selectedTab = n.selectedTab || {}, n.$watch(function() {
return e.tab;
}, function(e) {
e && (n.selectedTab[e] = !0);
}), n.$watch("selectedTab", function() {
var e = _.keys(_.pickBy(n.selectedTab, function(e) {
return e;
}));
if (1 === e.length) {
var a = t.search();
a.tab = e[0], t.replace().search(a);
}
}, !0);
}
};
} ]), angular.module("openshiftConsole").directive("labels", [ "$location", "$timeout", "LabelFilter", function(e, t, n) {
return {
restrict: "E",
scope: {
labels: "=",
clickable: "@?",
kind: "@?",
projectName: "@?",
limit: "=?",
titleKind: "@?",
navigateUrl: "@?",
filterCurrentPage: "=?"
},
templateUrl: "views/directives/labels.html",
link: function(a) {
a.filterAndNavigate = function(r, o) {
a.kind && a.projectName && (a.filterCurrentPage || e.url(a.navigateUrl || "/project/" + a.projectName + "/browse/" + a.kind), t(function() {
var e = {};
e[r] = o, n.setLabelSelector(new LabelSelector(e, !0));
}, 1));
};
}
};
} ]).directive("labelEditor", function() {
function e(e) {
return !(e.length > o) && r.test(e);
}
function t(e) {
return !(e.length > a) && n.test(e);
}
var n = /^(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9])?$/, a = 63, r = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/, o = 253;
return {
restrict: "E",
scope: {
labels: "=",
expand: "=?",
canToggle: "=?",
helpText: "@?"
},
templateUrl: "views/directives/label-editor.html",
link: function(e, t, n) {
angular.isDefined(n.canToggle) || (e.canToggle = !0);
},
controller: [ "$scope", function(n) {
var a = {
test: function(n) {
var a = n.split("/");
switch (a.length) {
case 1:
return t(a[0]);

case 2:
return e(a[0]) && t(a[1]);
}
return !1;
}
};
angular.extend(n, {
validator: {
key: a,
value: a
}
});
} ]
};
}), angular.module("openshiftConsole").directive("editLifecycleHook", [ "APIService", function(e) {
return {
restrict: "E",
scope: {
type: "@",
hookParams: "=model",
availableVolumes: "=",
availableContainers: "=",
availableSecrets: "=",
availableConfigMaps: "=",
namespace: "="
},
templateUrl: "views/directives/edit-lifecycle-hook.html",
controller: [ "$scope", function(t) {
t.secretsVersion = e.getPreferredVersion("secrets"), t.configMapsVersion = e.getPreferredVersion("configmaps"), t.view = {
isDisabled: !1
}, t.lifecycleHookFailurePolicyTypes = [ "Abort", "Retry", "Ignore" ], t.istagHook = {}, t.removedHookParams = {}, t.action = {
type: _.has(t.hookParams, "tagImages") ? "tagImages" : "execNewPod"
};
var n = {
command: [],
env: [],
volumes: [],
containerName: t.availableContainers[0] || ""
}, a = {
to: {},
containerName: t.availableContainers[0] || ""
}, r = function(e) {
var n = {};
if (_.isEmpty(e)) n = {
namespace: t.namespace,
imageStream: "",
tagObject: null
}; else {
var a = e.name.split(":");
n = {
namespace: e.namespace || t.namespace,
imageStream: a[0],
tagObject: {
tag: a[1]
}
};
}
return n;
}, o = function() {
"execNewPod" === t.action.type ? (_.has(t.removedHookParams, "execNewPod") ? t.hookParams.execNewPod = t.removedHookParams.execNewPod : t.hookParams.execNewPod = _.get(t, "hookParams.execNewPod", {}), t.hookParams.execNewPod = _.merge(angular.copy(n), t.hookParams.execNewPod)) : (_.has(t.removedHookParams, "tagImages") ? t.hookParams.tagImages = t.removedHookParams.tagImages : t.hookParams.tagImages = _.get(t, "hookParams.tagImages", [ {} ]), t.hookParams.tagImages = [ _.merge(angular.copy(a), t.hookParams.tagImages[0]) ], t.istagHook = r(_.head(t.hookParams.tagImages).to)), t.hookParams.failurePolicy = _.get(t.hookParams, "failurePolicy", "Abort");
};
t.addHook = function() {
_.isEmpty(t.removedHookParams) ? (t.hookParams = {}, o()) : t.hookParams = t.removedHookParams;
}, t.removeHook = function() {
t.removedHookParams = t.hookParams, delete t.hookParams, t.editForm.$setDirty();
};
t.$watchGroup([ "hookParams", "action.type" ], function() {
t.hookParams && ("execNewPod" === t.action.type ? (t.hookParams.tagImages && (t.removedHookParams.tagImages = t.hookParams.tagImages, delete t.hookParams.tagImages), o()) : "tagImages" === t.action.type && (t.hookParams.execNewPod && (t.removedHookParams.execNewPod = t.hookParams.execNewPod, delete t.hookParams.execNewPod), o()));
}), t.valueFromObjects = [], t.$watchGroup([ "availableSecrets", "availableConfigMaps" ], function() {
var e = t.availableConfigMaps || [], n = t.availableSecrets || [];
t.valueFromObjects = e.concat(n);
}), t.$watch("istagHook.tagObject.tag", function() {
_.has(t.istagHook, [ "tagObject", "tag" ]) && (_.set(t.hookParams, "tagImages[0].to.kind", "ImageStreamTag"), _.set(t.hookParams, "tagImages[0].to.namespace", t.istagHook.namespace), _.set(t.hookParams, "tagImages[0].to.name", t.istagHook.imageStream + ":" + t.istagHook.tagObject.tag));
});
} ]
};
} ]).directive("lifecycleHook", [ "$filter", "APIService", function(e, t) {
return {
restrict: "E",
scope: {
deploymentConfig: "=",
type: "@"
},
templateUrl: "views/directives/lifecycle-hook.html",
link: function(n) {
n.secretsVersion = t.getPreferredVersion("secrets"), n.configMapsVersion = t.getPreferredVersion("configmaps"), n.$watch("deploymentConfig", function(t) {
n.strategyParams = e("deploymentStrategyParams")(t);
});
}
};
} ]), angular.module("openshiftConsole").directive("actionChip", function() {
return {
restrict: "E",
scope: {
key: "=?",
value: "=?",
keyHelp: "=?",
valueHelp: "=",
action: "&?",
actionIcon: "=?",
actionTitle: "@",
showAction: "=?"
},
templateUrl: "views/directives/action-chip.html"
};
}), function() {
angular.module("openshiftConsole").component("addConfigToApplication", {
controller: [ "$filter", "$scope", "APIService", "ApplicationsService", "DataService", "Navigate", "NotificationsService", "StorageService", function(e, t, n, a, r, o, i, s) {
var c = this, l = e("humanizeKind"), u = function(e) {
var t = c.apiObject.metadata.name;
return "ConfigMap" === c.apiObject.kind ? _.some(e.envFrom, {
configMapRef: {
name: t
}
}) : _.some(e.envFrom, {
secretRef: {
name: t
}
});
};
c.checkApplicationContainersRefs = function(e) {
var t = _.get(e, "spec.template.spec.containers");
c.canAddRefToApplication = !_.every(t, u);
};
var d = function() {
var e = {
namespace: c.project.metadata.name
};
a.getApplications(e).then(function(e) {
c.applications = e, c.updating = !1;
});
};
c.$onInit = function() {
c.addType = "env", c.disableInputs = !1, d(), c.canAddRefToApplication = !0;
var e = new RegExp("^[A-Za-z_][A-Za-z0-9_]*$");
c.hasInvalidEnvVars = _.some(c.apiObject.data, function(t, n) {
return !e.test(n);
});
};
var m = function(e) {
return c.attachAllContainers || c.attachContainers[e.name];
};
c.$postLink = function() {
t.$watch(function() {
return c.application;
}, function() {
var e = _.get(c.application, "spec.template");
c.existingMountPaths = s.getMountPaths(e), c.attachAllContainers = !0;
});
}, c.groupByKind = function(e) {
return l(e.kind);
}, c.addToApplication = function() {
var t = angular.copy(c.application), a = _.get(t, "spec.template");
if (c.disableInputs = !0, "env" === c.addType) {
var s = {};
switch (c.apiObject.kind) {
case "Secret":
s.secretRef = {
name: c.apiObject.metadata.name
};
break;

case "ConfigMap":
s.configMapRef = {
name: c.apiObject.metadata.name
};
}
c.envPrefix && (s.prefix = c.envPrefix), _.each(a.spec.containers, function(e) {
m(e) && !u(e) && (e.envFrom = e.envFrom || [], e.envFrom.push(s));
});
} else {
var l = e("generateName")(c.apiObject.metadata.name + "-"), d = {
name: l,
mountPath: c.mountVolume,
readOnly: !0
};
_.each(a.spec.containers, function(e) {
m(e) && (e.volumeMounts = e.volumeMounts || [], e.volumeMounts.push(d));
});
var p = {
name: l
};
switch (c.apiObject.kind) {
case "Secret":
p.secret = {
secretName: c.apiObject.metadata.name
};
break;

case "ConfigMap":
p.configMap = {
name: c.apiObject.metadata.name
};
}
a.spec.volumes = a.spec.volumes || [], a.spec.volumes.push(p);
}
var g = e("humanizeKind"), f = g(c.apiObject.kind), h = g(t.kind), v = {
namespace: c.project.metadata.name
};
r.update(n.objectToResourceGroupVersion(t), t.metadata.name, t, v).then(function() {
i.addNotification({
type: "success",
message: "Successfully added " + f + " " + c.apiObject.metadata.name + " to " + h + " " + t.metadata.name + ".",
links: [ {
href: o.resourceURL(t),
label: "View " + g(t.kind, !0)
} ]
}), angular.isFunction(c.onComplete) && c.onComplete();
}, function(n) {
var a = e("getErrorDetails");
i.addNotification({
type: "error",
message: "An error occurred  adding " + f + " " + c.apiObject.metadata.name + " to " + h + " " + t.metadata.name + ". " + a(n)
});
}).finally(function() {
c.disableInputs = !1;
});
};
} ],
controllerAs: "ctrl",
bindings: {
project: "<",
apiObject: "<",
onComplete: "<",
onCancel: "<"
},
templateUrl: "views/directives/add-config-to-application.html"
});
}(), angular.module("openshiftConsole").directive("templateOptions", function() {
return {
restrict: "E",
templateUrl: "views/_templateopt.html",
transclude: !0,
scope: {
parameters: "=",
expand: "=?",
canToggle: "=?",
isDialog: "=?"
},
link: function(e, t, n) {
angular.isDefined(n.canToggle) || (e.canToggle = !0), e.isOnlyWhitespace = function(e) {
return /^\s+$/.test(e);
}, e.focus = function(e) {
angular.element("#" + e).focus();
};
}
};
}), angular.module("openshiftConsole").directive("catalog", [ "CatalogService", "Constants", "KeywordService", "Logger", function(e, t, n, a) {
return {
restrict: "E",
scope: {
projectImageStreams: "=",
openshiftImageStreams: "=",
projectTemplates: "=",
openshiftTemplates: "=",
projectName: "=",
parentCategory: "=category"
},
templateUrl: "views/catalog/catalog.html",
link: function(r, o) {
function i() {
var t = r.keywords = n.generateKeywords(r.filter.keyword);
if (_.isEmpty(t)) return r.filterActive = !1, r.filteredBuildersByCategory = r.buildersByCategory, void (r.filteredTemplatesByCategory = r.templatesByCategory);
r.filterActive = !0, r.filteredBuildersByCategory = {}, _.each(r.buildersByCategory, function(n, a) {
var o = e.getCategoryItem(a), i = _.reject(t, function(e) {
return e.test(o.label);
});
r.filteredBuildersByCategory[a] = e.filterImageStreams(n, i);
}), r.filteredBuildersNoSubcategory = e.filterImageStreams(r.buildersNoSubcategory, t), r.filteredTemplatesByCategory = {}, _.each(r.templatesByCategory, function(n, a) {
var o = e.getCategoryItem(a), i = _.reject(t, function(e) {
return e.test(o.label);
});
r.filteredTemplatesByCategory[a] = e.filterTemplates(n, i);
}), r.filteredTemplatesNoSubcategory = e.filterTemplates(r.templatesNoSubcategory, t);
}
function s(e) {
var t = _.get(r, "parentCategory.subcategories", []);
if (_.isEmpty(t)) return [];
var n = {};
_.each(t, function(t) {
_.each(t.items, function(t) {
_.each(e[t.id], function(e) {
var t = _.get(e, "metadata.uid");
n[t] = !0;
});
});
});
var a = r.parentCategory.id;
return _.reject(e[a], function(e) {
var t = _.get(e, "metadata.uid");
return !!n[t];
});
}
function c() {
r.noFilterMatches = !0, d = [];
var e = {};
_.each(r.filteredBuildersByCategory, function(t, n) {
e[n] = _.size(t);
}), _.each(r.filteredTemplatesByCategory, function(t, n) {
e[n] = (e[n] || 0) + _.size(t);
}), r.allContentHidden = !0, _.each(r.categories, function(t) {
var n = !1;
_.each(t.items, function(t) {
e[t.id] && (d.push(t), n = !0);
}), _.set(r, [ "hasContent", t.id ], n), n && (r.allContentHidden = !1);
}), r.countByCategory = e, r.hasItemsNoSubcategory = !_.isEmpty(r.buildersNoSubcategory) || !_.isEmpty(r.templatesNoSubcategory), r.countFilteredNoSubcategory = _.size(r.filteredBuildersNoSubcategory) + _.size(r.filteredTemplatesNoSubcategory), r.countFilteredNoSubcategory && (r.allContentHidden = !1);
}
function l() {
return !!r.parentCategory && (1 === d.length && !r.hasItemsNoSubcategory);
}
function u() {
r.loaded = r.projectTemplates && r.openshiftTemplates && r.projectImageStreams && r.openshiftImageStreams, i(), c(), r.loaded && (l() && (r.singleCategory = _.head(d)), a.log("templates by category", r.templatesByCategory), a.log("builder images", r.buildersByCategory));
}
r.categories = _.get(r, "parentCategory.subcategories", t.CATALOG_CATEGORIES(o)), r.loaded = !1, r.emptyCatalog = !0, r.filter = {
keyword: ""
}, r.$watch("filter.keyword", _.debounce(function() {
r.$apply(function() {
i(), c();
});
}, 200, {
maxWait: 1e3,
trailing: !0
}));
var d;
r.$watchGroup([ "openshiftImageStreams", "projectImageStreams" ], function() {
if (r.projectImageStreams && r.openshiftImageStreams) {
var t = _.toArray(r.projectImageStreams).concat(_.toArray(r.openshiftImageStreams));
r.buildersByCategory = e.categorizeImageStreams(t), r.buildersNoSubcategory = s(r.buildersByCategory), r.emptyCatalog = r.emptyCatalog && _.every(r.buildersByCategory, _.isEmpty) && _.isEmpty(r.buildersNoSubcategory), u();
}
}), r.$watchGroup([ "openshiftTemplates", "projectTemplates" ], function() {
if (r.projectTemplates && r.openshiftTemplates) {
var t = _.toArray(r.projectTemplates).concat(_.toArray(r.openshiftTemplates));
r.templatesByCategory = e.categorizeTemplates(t), r.templatesNoSubcategory = s(r.templatesByCategory), r.emptyCatalog = r.emptyCatalog && _.every(r.templatesByCategory, _.isEmpty) && _.isEmpty(r.templatesNoSubcategory), u();
}
});
}
};
} ]), angular.module("openshiftConsole").directive("categoryContent", [ "CatalogService", "Constants", "KeywordService", "Logger", function(e, t, n, a) {
return {
restrict: "E",
scope: {
projectImageStreams: "=",
openshiftImageStreams: "=",
projectTemplates: "=",
openshiftTemplates: "=",
projectName: "=",
category: "="
},
templateUrl: "views/catalog/category-content.html",
link: function(t) {
function r() {
var a = t.keywords = n.generateKeywords(t.filter.keyword);
t.filteredBuilderImages = e.filterImageStreams(c, a), t.filteredTemplates = e.filterTemplates(l, a);
}
function o() {
return t.projectImageStreams && t.openshiftImageStreams ? _.toArray(t.projectImageStreams).concat(_.toArray(t.openshiftImageStreams)) : [];
}
function i() {
return t.projectTemplates && t.openshiftTemplates ? _.toArray(t.projectTemplates).concat(_.toArray(t.openshiftTemplates)) : [];
}
function s() {
t.loaded = t.projectTemplates && t.openshiftTemplates && t.projectImageStreams && t.openshiftImageStreams, r(), t.emptyCategory = _.isEmpty(c) && _.isEmpty(l), t.loaded && (a.log("templates", l), a.log("builder images", c));
}
var c = [], l = [];
t.filteredTemplates = [], t.filteredBuilderImages = [], t.loaded = !1, t.filter = {
keyword: ""
}, t.$watch("filter.keyword", r), t.$watchGroup([ "openshiftImageStreams", "projectImageStreams" ], function() {
var n = e.categorizeImageStreams(o());
c = _.get(n, [ t.category.id ], []), s();
}), t.$watchGroup([ "openshiftTemplates", "projectTemplates" ], function() {
var n = e.categorizeTemplates(i());
l = _.get(n, [ t.category.id ], []), s();
});
}
};
} ]), angular.module("openshiftConsole").directive("catalogImage", [ "$filter", "CatalogService", function(e, t) {
return {
restrict: "E",
replace: !0,
scope: {
image: "=",
imageStream: "=",
project: "@",
isBuilder: "=?",
keywords: "="
},
templateUrl: "views/catalog/_image.html",
link: function(n) {
var a = e("imageStreamTagTags"), r = {};
n.referencedBy = {};
var o = _.get(n, "imageStream.spec.tags", []), i = {};
_.each(o, function(e) {
i[e.name] = a(n.imageStream, e.name), t.referencesSameImageStream(e) && (r[e.name] = !0, n.referencedBy[e.from.name] = n.referencedBy[e.from.name] || [], n.referencedBy[e.from.name].push(e.name));
});
var s = function(e) {
var t = _.get(i, [ e ], []);
return _.includes(t, "builder") && !_.includes(t, "hidden");
};
n.$watch("imageStream.status.tags", function(e) {
n.tags = _.filter(e, function(e) {
return s(e.tag) && !r[e.tag];
});
var t = _.get(n, "is.tag.tag");
t && _.some(n.tags, {
tag: t
}) || _.set(n, "is.tag", _.head(n.tags));
});
}
};
} ]), angular.module("openshiftConsole").directive("catalogTemplate", function() {
return {
restrict: "E",
replace: !0,
scope: {
template: "=",
project: "@",
keywords: "="
},
templateUrl: "views/catalog/_template.html"
};
}), angular.module("openshiftConsole").directive("podMetrics", [ "$filter", "$interval", "$parse", "$timeout", "$q", "$rootScope", "ChartsService", "ConversionService", "MetricsCharts", "MetricsService", "ModalsService", "usageValueFilter", function(e, t, n, a, r, o, i, s, c, l, u, d) {
return {
restrict: "E",
scope: {
pod: "=",
includedMetrics: "=?",
stackDonut: "=?",
alerts: "=?"
},
templateUrl: "views/directives/pod-metrics.html",
link: function(m) {
function p(e) {
if (!m.pod) return null;
var t = m.options.selectedContainer;
switch (e) {
case "memory/usage":
var n = N(t);
if (n) return s.bytesToMiB(d(n));
break;

case "cpu/usage_rate":
var a = A(t);
if (a) return d(a);
}
return null;
}
function g(e) {
var t = _.head(e.datasets);
if (t.total) {
var n, r = {
type: "donut",
columns: [ [ "Used", t.used ], [ "Available", Math.max(t.available, 0) ] ],
colors: {
Used: t.available > 0 ? "#0088ce" : "#ec7a08",
Available: "#d1d1d1"
}
};
I[t.id] ? I[t.id].load(r) : ((n = B(e)).data = r, a(function() {
D || (I[t.id] = c3.generate(n));
}));
}
}
function f(e) {
if (!_.some(e.datasets, function(e) {
return !e.data;
})) {
var t = {};
_.each(e.datasets, function(e) {
t[e.id] = e.data;
});
var n, r = c.getSparklineData(t), o = e.chartPrefix + "sparkline";
T[o] ? T[o].load(r) : ((n = L(e)).data = r, e.chartDataColors && (n.color = {
pattern: e.chartDataColors
}), a(function() {
D || (T[o] = c3.generate(n));
}));
}
}
function h() {
return "-" + m.options.timeRange.value + "mn";
}
function v() {
return 60 * m.options.timeRange.value * 1e3;
}
function y() {
return Math.floor(v() / E) + "ms";
}
function b(e, t, n) {
var a, r = {
metric: t.id,
type: t.type,
bucketDuration: y()
};
return t.data && t.data.length ? (a = _.last(t.data), r.start = a.end) : r.start = n, m.pod ? _.assign(r, {
namespace: m.pod.metadata.namespace,
pod: m.pod,
containerName: e.containerMetric ? m.options.selectedContainer.name : "pod"
}) : null;
}
function S() {
D || (V = 0, _.each(m.metrics, function(e) {
f(e), g(e);
}));
}
function C(e) {
if (!D) if (V++, m.noData) m.metricsError = {
status: _.get(e, "status", 0),
details: _.get(e, "data.errorMsg") || _.get(e, "statusText") || "Status code " + _.get(e, "status", 0)
}; else if (!(V < 2)) {
var t = "metrics-failed-" + m.uniqueID;
m.alerts[t] = {
type: "error",
message: "An error occurred updating metrics for pod " + _.get(m, "pod.metadata.name", "<unknown>") + ".",
links: [ {
href: "",
label: "Retry",
onClick: function() {
delete m.alerts[t], V = 1, j();
}
} ]
};
}
}
function w() {
return !(m.metricsError || V > 1) && (m.pod && _.get(m, "options.selectedContainer"));
}
function P(e, t, n) {
t.total = p(t.id), t.total && (m.hasLimits = !0);
var a = _.get(n, "usage.value");
isNaN(a) && (a = 0), e.convert && (a = e.convert(a)), t.used = d3.round(a, e.usagePrecision), t.total && (t.available = d3.round(t.total - a, e.usagePrecision)), e.totalUsed += t.used;
}
function k(e, t) {
m.noData = !1;
var n = _.initial(t.data);
e.data ? e.data = _.chain(e.data).takeRight(E).concat(n).value() : e.data = n;
}
function j() {
if (w()) {
var e = h(), t = [];
angular.forEach(m.metrics, function(n) {
var a = [];
n.totalUsed = 0, angular.forEach(n.datasets, function(r) {
var o = b(n, r, e);
if (o) {
var i = l.get(o);
a.push(i), p(r.id) && t.push(l.getCurrentUsage(o).then(function(e) {
P(n, r, e);
}));
}
}), t = t.concat(a), r.all(a).then(function(e) {
D || angular.forEach(e, function(e) {
e && k(_.find(n.datasets, {
id: e.metricID
}), e);
});
});
}), r.all(t).then(S, C).finally(function() {
m.loaded = !0;
});
}
}
m.includedMetrics = m.includedMetrics || [ "cpu", "memory", "network" ];
var R, I = {}, T = {}, N = n("resources.limits.memory"), A = n("resources.limits.cpu"), E = 30, D = !1;
m.uniqueID = c.uniqueID(), m.metrics = [], _.includes(m.includedMetrics, "memory") && m.metrics.push({
label: "Memory",
units: "MiB",
chartPrefix: "memory-",
convert: s.bytesToMiB,
containerMetric: !0,
datasets: [ {
id: "memory/usage",
label: "Memory",
data: []
} ]
}), _.includes(m.includedMetrics, "cpu") && m.metrics.push({
label: "CPU",
units: "cores",
chartPrefix: "cpu-",
convert: s.millicoresToCores,
usagePrecision: 3,
containerMetric: !0,
datasets: [ {
id: "cpu/usage_rate",
label: "CPU",
data: []
} ]
}), _.includes(m.includedMetrics, "network") && m.metrics.push({
label: "Network",
units: "KiB/s",
chartPrefix: "network-",
chartType: "spline",
convert: s.bytesToKiB,
datasets: [ {
id: "network/tx_rate",
label: "Sent",
data: []
}, {
id: "network/rx_rate",
label: "Received",
data: []
} ]
}), m.loaded = !1, m.noData = !0, m.showComputeUnitsHelp = function() {
u.showComputeUnitsHelp();
}, l.getMetricsURL().then(function(e) {
m.metricsURL = e;
}), m.options = {
rangeOptions: c.getTimeRangeOptions()
}, m.options.timeRange = _.head(m.options.rangeOptions);
var $ = e("upperFirst"), B = function(e) {
var t = "#" + e.chartPrefix + m.uniqueID + "-donut";
return {
bindto: t,
onrendered: function() {
i.updateDonutCenterText(t, e.datasets[0].used, $(e.units) + " Used");
},
donut: {
label: {
show: !1
},
width: 10
},
legend: {
show: !1
},
size: {
height: 175,
widht: 175
}
};
}, L = function(e) {
var t = e.chartPrefix + m.uniqueID + "-sparkline", n = c.getDefaultSparklineConfig(t, e.units);
return 1 === e.datasets.length && _.set(n, "legend.show", !1), n;
}, V = 0;
(window.OPENSHIFT_CONSTANTS.DISABLE_CUSTOM_METRICS ? r.when({}) : l.getCustomMetrics(m.pod).then(function(e) {
angular.forEach(e, function(e) {
var t = e.description || e.name, n = e.unit || "", a = "custom/" + e.id.replace(/.*\/custom\//, "");
m.metrics.push({
label: t,
units: n,
chartPrefix: "custom-" + _.uniqueId("custom-metric-"),
chartType: "spline",
datasets: [ {
id: a,
label: t,
type: e.type,
data: []
} ]
});
});
})).finally(function() {
m.$watch("options", function() {
_.each(m.metrics, function(e) {
_.each(e.datasets, function(e) {
delete e.data;
});
}), delete m.metricsError, j();
}, !0), R = t(j, c.getDefaultUpdateInterval(), !1);
});
var U = o.$on("metrics.charts.resize", function() {
c.redraw(I), c.redraw(T);
});
m.$on("$destroy", function() {
R && (t.cancel(R), R = null), U && (U(), U = null), angular.forEach(I, function(e) {
e.destroy();
}), I = null, angular.forEach(T, function(e) {
e.destroy();
}), T = null, D = !0;
});
}
};
} ]), angular.module("openshiftConsole").directive("deploymentMetrics", [ "$interval", "$parse", "$timeout", "$q", "$rootScope", "ChartsService", "ConversionService", "MetricsCharts", "MetricsService", "ModalsService", function(e, t, n, a, r, o, i, s, c, l) {
return {
restrict: "E",
scope: {
pods: "=",
containers: "=",
profile: "@",
alerts: "=?"
},
templateUrl: function(e, t) {
return "compact" === t.profile ? "views/directives/metrics-compact.html" : "views/directives/deployment-metrics.html";
},
link: function(t) {
function n(e) {
return null === e.value || void 0 === e.value;
}
function a(e) {
var t, a = {}, r = [ "Date" ], o = [ t = w ? e.compactDatasetLabel || e.label : "Average Usage" ], i = [ r, o ], s = function(e) {
var t = "" + e.start;
return a[t] || (a[t] = {
total: 0,
count: 0
}), a[t];
};
return _.each(R[e.descriptor], function(e) {
_.each(e, function(e) {
var t = s(e);
(!k || k < e.end) && (k = e.end), n(e) || (t.total += e.value, t.count = t.count + 1);
});
}), _.each(a, function(t, n) {
var a;
a = t.count ? t.total / t.count : null, r.push(Number(n)), o.push(e.convert ? e.convert(a) : a);
}), o.length > 1 && (e.lastValue = _.last(o) || 0), i;
}
function o(e, r) {
var o = [], i = {
type: "spline"
};
return t.showAverage ? (_.each(e[r.descriptor], function(e, t) {
v(r.descriptor, t, e);
}), i.type = "area-spline", w && r.compactType && (i.type = r.compactType), i.x = "Date", i.columns = a(r), i) : (_.each(e[r.descriptor], function(e, t) {
v(r.descriptor, t, e);
var a = t + "-dates";
_.set(i, [ "xs", t ], a);
var s = [ a ], c = [ t ];
o.push(s), o.push(c), _.each(R[r.descriptor][t], function(e) {
if (s.push(e.start), (!k || k < e.end) && (k = e.end), n(e)) c.push(e.value); else {
var t = r.convert ? r.convert(e.value) : e.value;
c.push(t);
}
});
}), i.columns = _.sortBy(o, function(e) {
return e[0];
}), i);
}
function u(e) {
P || (A = 0, t.showAverage = _.size(t.pods) > 5 || w, _.each(t.metrics, function(n) {
var a, r = o(e, n), i = n.descriptor;
w && n.compactCombineWith && (i = n.compactCombineWith, n.lastValue && (N[i].lastValue = (N[i].lastValue || 0) + n.lastValue)), S[i] ? (S[i].load(r), t.showAverage ? S[i].legend.hide() : S[i].legend.show()) : ((a = E(n)).data = r, S[i] = c3.generate(a));
}));
}
function d() {
return w ? "-15mn" : "-" + t.options.timeRange.value + "mn";
}
function m() {
return 60 * t.options.timeRange.value * 1e3;
}
function p() {
return w ? "1mn" : Math.floor(m() / C) + "ms";
}
function g() {
var e = _.find(t.pods, "metadata.namespace");
if (e) {
var n = {
pods: t.pods,
namespace: e.metadata.namespace,
bucketDuration: p()
};
return w || (n.containerName = t.options.selectedContainer.name), n.start = k || d(), n;
}
}
function f(e) {
if (!P) if (A++, t.noData) t.metricsError = {
status: _.get(e, "status", 0),
details: _.get(e, "data.errorMsg") || _.get(e, "statusText") || "Status code " + _.get(e, "status", 0)
}; else if (!(A < 2) && t.alerts) {
var n = "metrics-failed-" + t.uniqueID;
t.alerts[n] = {
type: "error",
message: "An error occurred updating metrics.",
links: [ {
href: "",
label: "Retry",
onClick: function() {
delete t.alerts[n], A = 1, y();
}
} ]
};
}
}
function h() {
return _.isEmpty(t.pods) ? (t.loaded = !0, !1) : !t.metricsError && A < 2;
}
function v(e, n, a) {
t.noData = !1;
var r = _.initial(a), o = _.get(R, [ e, n ]);
if (o) {
var i = _.takeRight(o.concat(r), C);
_.set(R, [ e, n ], i);
} else _.set(R, [ e, n ], r);
}
function y() {
if (!I && h()) {
j = Date.now();
var e = g();
c.getPodMetrics(e).then(u, f).finally(function() {
t.loaded = !0;
});
}
}
var b, S = {}, C = 30, w = "compact" === t.profile, P = !1;
t.uniqueID = s.uniqueID();
var k, j, R = {}, I = w, T = function(e) {
return e >= 1024;
};
t.metrics = [ {
label: "Memory",
units: "MiB",
convert: i.bytesToMiB,
formatUsage: function(e) {
return T(e) && (e /= 1024), s.formatUsage(e);
},
usageUnits: function(e) {
return T(e) ? "GiB" : "MiB";
},
descriptor: "memory/usage",
type: "pod_container",
chartID: "memory-" + t.uniqueID
}, {
label: "CPU",
units: "cores",
convert: i.millicoresToCores,
formatUsage: s.formatUsage,
usageUnits: function() {
return "cores";
},
descriptor: "cpu/usage_rate",
type: "pod_container",
chartID: "cpu-" + t.uniqueID
}, {
label: "Network (Sent)",
units: "KiB/s",
convert: i.bytesToKiB,
formatUsage: s.formatUsage,
usageUnits: function() {
return "KiB/s";
},
descriptor: "network/tx_rate",
type: "pod",
compactLabel: "Network",
compactDatasetLabel: "Sent",
compactType: "spline",
chartID: "network-tx-" + t.uniqueID
}, {
label: "Network (Received)",
units: "KiB/s",
convert: i.bytesToKiB,
formatUsage: s.formatUsage,
usageUnits: function() {
return "KiB/s";
},
descriptor: "network/rx_rate",
type: "pod",
compactCombineWith: "network/tx_rate",
compactDatasetLabel: "Received",
compactType: "spline",
chartID: "network-rx-" + t.uniqueID
} ];
var N = _.keyBy(t.metrics, "descriptor");
t.loaded = !1, t.noData = !0, t.showComputeUnitsHelp = function() {
l.showComputeUnitsHelp();
};
var A = 0;
c.getMetricsURL().then(function(e) {
t.metricsURL = e;
}), t.options = {
rangeOptions: s.getTimeRangeOptions()
}, t.options.timeRange = _.head(t.options.rangeOptions), t.options.selectedContainer = _.head(t.containers);
var E = function(e) {
var n = s.getDefaultSparklineConfig(e.chartID, e.units, w);
return _.set(n, "legend.show", !w && !t.showAverage), n;
};
t.$watch("options", function() {
R = {}, k = null, delete t.metricsError, y();
}, !0), b = e(y, s.getDefaultUpdateInterval(), !1), t.updateInView = function(e) {
I = !e, e && (!j || Date.now() > j + s.getDefaultUpdateInterval()) && y();
};
var D = r.$on("metrics.charts.resize", function() {
s.redraw(S);
});
t.$on("$destroy", function() {
b && (e.cancel(b), b = null), D && (D(), D = null), angular.forEach(S, function(e) {
e.destroy();
}), S = null, P = !0;
});
}
};
} ]), angular.module("openshiftConsole").directive("logViewer", [ "$sce", "$timeout", "$window", "$filter", "$q", "AuthService", "APIService", "APIDiscovery", "DataService", "HTMLService", "ModalsService", "logLinks", "BREAKPOINTS", function(e, t, n, a, r, o, i, s, c, l, u, d) {
var m = $(window), p = $('<tr class="log-line"><td class="log-line-number"></td><td class="log-line-text"></td></tr>').get(0), g = function(e, t) {
var n = p.cloneNode(!0);
n.firstChild.setAttribute("data-line-number", e);
var a = ansi_up.escape_for_html(t), r = ansi_up.ansi_to_html(a), o = l.linkify(r, "_blank", !0);
return n.lastChild.innerHTML = o, n;
};
return {
restrict: "AE",
transclude: !0,
templateUrl: "views/directives/logs/_log-viewer.html",
scope: {
followAffixTop: "=?",
object: "=",
fullLogUrl: "=?",
name: "=",
context: "=",
options: "=?",
fixedHeight: "=?",
chromeless: "=?",
empty: "=?",
run: "=?"
},
controller: [ "$scope", function(t) {
var l, u, p, f = document.documentElement;
t.logViewerID = _.uniqueId("log-viewer"), t.empty = !0;
var h, v;
"ReplicationController" === t.object.kind ? (h = "deploymentconfigs/log", v = a("annotation")(t.object, "deploymentConfig")) : (h = i.kindToResource(t.object.kind) + "/log", v = t.object.metadata.name);
var y, b = function() {
t.$apply(function() {
var e = l.getBoundingClientRect();
t.fixedHeight ? t.showScrollLinks = e && e.height > t.fixedHeight : t.showScrollLinks = e && (e.top < 0 || e.bottom > f.clientHeight);
});
}, S = !1, C = function() {
S ? S = !1 : t.$evalAsync(function() {
t.autoScrollActive = !1;
});
}, w = function() {
u ? $(u).on("scroll", C) : m.on("scroll", C);
}, P = function() {
t.fixedHeight || p.affix({
target: window,
offset: {
top: t.followAffixTop || 0
}
});
}, k = function() {
return $("#" + t.logViewerID + " .log-view-output");
}, j = function(e) {
var n = k(), a = n.offset().top;
if (!(a < 0)) {
var r = $(".ellipsis-pulser").outerHeight(!0), o = t.fixedHeight ? t.fixedHeight : Math.floor($(window).height() - a - r);
t.chromeless || t.fixedHeight || (o -= 40), e ? n.animate({
"min-height": o + "px"
}, "fast") : n.css("min-height", o + "px"), t.fixedHeight && n.css("max-height", o);
}
}, R = function() {
if (!y) {
var e = function() {
clearInterval(y), y = null, t.$evalAsync(function() {
t.sized = !0;
});
}, n = 0;
y = setInterval(function() {
n > 10 ? e() : (n++, k().is(":visible") && (j(), e()));
}, 100);
}
}, I = _.debounce(function() {
j(!0), b(), C();
}, 100);
m.on("resize", I);
var T, N = function() {
S = !0, d.scrollBottom(u);
}, A = document.createDocumentFragment(), E = _.debounce(function() {
l.appendChild(A), A = document.createDocumentFragment(), t.autoScrollActive && N(), t.showScrollLinks || b();
}, 100, {
maxWait: 300
}), D = function(e) {
var t = r.defer();
return T ? (T.onClose(function() {
t.resolve();
}), T.stop()) : t.resolve(), e || (E.cancel(), l && (l.innerHTML = ""), A = document.createDocumentFragment()), t.promise;
}, B = function() {
D().then(function() {
t.$evalAsync(function() {
if (t.run) {
angular.extend(t, {
loading: !0,
autoScrollActive: !0,
largeLog: !1,
limitReached: !1,
showScrollLinks: !1,
state: ""
});
var e = angular.extend({
follow: !0,
tailLines: 5e3,
limitBytes: 10485760
}, t.options), n = 0, a = "", r = function(e) {
return /\n$/.test(e);
}, o = function(e) {
return e.match(/^.*(\n|$)/gm);
}, i = function(e) {
var t = a + e;
r(e) ? (a = "", n++, A.appendChild(g(n, t)), E()) : a = t;
}, s = function(e) {
var t = o(e);
_.each(t, i);
};
(T = c.createStream(h, v, t.context, e)).onMessage(function(a, r, o) {
t.$evalAsync(function() {
t.empty = !1, "logs" !== t.state && (t.state = "logs", R());
}), a && (e.limitBytes && o >= e.limitBytes && (t.$evalAsync(function() {
t.limitReached = !0, t.loading = !1;
}), D(!0)), s(a), !t.largeLog && n >= e.tailLines && t.$evalAsync(function() {
t.largeLog = !0;
}));
}), T.onClose(function() {
T = null, t.$evalAsync(function() {
t.loading = !1, t.autoScrollActive = !1, 0 !== n || t.emptyStateMessage || (t.state = "empty", t.emptyStateMessage = "The logs are no longer available or could not be loaded.");
});
}), T.onError(function() {
T = null, t.$evalAsync(function() {
angular.extend(t, {
loading: !1,
autoScrollActive: !1
}), 0 === n ? (t.state = "empty", t.emptyStateMessage = "The logs are no longer available or could not be loaded.") : t.errorWhileRunning = !0;
});
}), T.start();
}
});
});
};
if (s.getLoggingURL(t.context.project).then(function(r) {
var i = _.get(t.context, "project.metadata.name"), s = _.get(t.options, "container");
i && s && v && r && (angular.extend(t, {
kibanaAuthUrl: e.trustAsResourceUrl(URI(r).segment("auth").segment("token").normalizePathname().toString()),
access_token: o.UserStore().getToken()
}), t.$watchGroup([ "context.project.metadata.name", "options.container", "name" ], function() {
angular.extend(t, {
kibanaArchiveUrl: e.trustAsResourceUrl(d.archiveUri({
namespace: t.context.project.metadata.name,
namespaceUid: t.context.project.metadata.uid,
podname: v,
containername: t.options.container,
backlink: URI.encode(n.location.href)
}, a("annotation")(t.context.project, "loggingDataPrefix")))
});
}));
}), this.cacheScrollableNode = function(e) {
u = e;
}, this.cacheLogNode = function(e) {
l = e;
}, this.cacheAffixable = function(e) {
p = $(e);
}, this.start = function() {
w(), P();
}, angular.extend(t, {
ready: !0,
loading: !0,
autoScrollActive: !0,
state: !1,
onScrollBottom: function() {
d.scrollBottom(u);
},
onScrollTop: function() {
t.autoScrollActive = !1, d.scrollTop(u), $("#" + t.logViewerID + "-affixedFollow").affix("checkPosition");
},
toggleAutoScroll: function() {
t.autoScrollActive = !t.autoScrollActive, t.autoScrollActive && N();
},
goChromeless: d.chromelessLink,
restartLogs: B
}), t.$on("$destroy", function() {
D(), m.off("resize", I), m.off("scroll", C), u && $(u).off("scroll", C);
}), "deploymentconfigs/logs" === h && !v) return t.state = "empty", void (t.emptyStateMessage = "Logs are not available for this replication controller because it was not generated from a deployment configuration.");
t.$watchGroup([ "name", "options.container", "run" ], B);
} ],
require: "logViewer",
link: function(e, n, a, r) {
t(function() {
e.fixedHeight && r.cacheScrollableNode(document.getElementById(e.logViewerID + "-fixed-scrollable")), r.cacheLogNode(document.getElementById(e.logViewerID + "-logContent")), r.cacheAffixable(document.getElementById(e.logViewerID + "-affixedFollow")), r.start();
}, 0);
var o = function() {
var t = $(n).find(".log-line-text").text(), a = _.get(e, "object.metadata.name", "openshift") + ".log", r = new Blob([ t ], {
type: "text/plain;charset=utf-8"
});
saveAs(r, a);
};
e.canSave = !!new Blob(), e.saveLog = function() {
e.largeLog ? u.confirmSaveLog(e.object).then(o) : o();
};
}
};
} ]), angular.module("openshiftConsole").directive("statusIcon", function() {
return {
restrict: "E",
templateUrl: "views/directives/_status-icon.html",
scope: {
status: "=",
disableAnimation: "@"
},
link: function(e, t, n) {
e.spinning = !angular.isDefined(n.disableAnimation);
}
};
}), angular.module("openshiftConsole").directive("ellipsisPulser", [ function() {
return {
restrict: "E",
scope: {
color: "@",
display: "@",
size: "@",
msg: "@"
},
templateUrl: "views/directives/_ellipsis-pulser.html"
};
} ]), angular.module("openshiftConsole").directive("podDonut", [ "$timeout", "isPullingImageFilter", "isTerminatingFilter", "podWarningsFilter", "numContainersReadyFilter", "Logger", "ChartsService", function(e, t, n, a, r, o, i) {
return {
restrict: "E",
scope: {
pods: "=",
desired: "=?",
idled: "=?",
mini: "=?"
},
templateUrl: "views/directives/pod-donut.html",
link: function(e, o) {
function s() {
var t = _.reject(e.pods, {
status: {
phase: "Failed"
}
}), n = _.size(t);
if (e.mini) e.$evalAsync(function() {
e.total = n;
}); else {
var a;
a = angular.isNumber(e.desired) && e.desired !== n ? "scaling to " + e.desired + "..." : 1 === n ? "pod" : "pods", e.idled ? i.updateDonutCenterText(o[0], "Idle") : i.updateDonutCenterText(o[0], n, a);
}
}
function c(e) {
return r(e) === _.size(e.spec.containers);
}
function l(e) {
if (n(e)) return "Terminating";
var r = a(e);
return _.some(r, {
severity: "error"
}) ? "Error" : _.isEmpty(r) ? t(e) ? "Pulling" : "Running" !== e.status.phase || c(e) ? _.get(e, "status.phase", "Unknown") : "Not Ready" : "Warning";
}
var u, d, m = [ "Running", "Not Ready", "Warning", "Error", "Pulling", "Pending", "Succeeded", "Terminating", "Unknown" ];
e.chartId = _.uniqueId("pods-donut-chart-"), d = {
type: "donut",
bindto: "#" + e.chartId,
donut: {
expand: !1,
label: {
show: !1
},
width: e.mini ? 5 : 10
},
size: {
height: e.mini ? 45 : 150,
width: e.mini ? 45 : 150
},
legend: {
show: !1
},
onrendered: s,
tooltip: {
format: {
value: function(e, t, n) {
if (e && "Empty" !== n) return e;
}
}
},
transition: {
duration: 350
},
data: {
type: "donut",
groups: [ m ],
order: null,
colors: {
Empty: "#ffffff",
Running: "#00b9e4",
"Not Ready": "#beedf9",
Warning: "#f39d3c",
Error: "#d9534f",
Pulling: "#d1d1d1",
Pending: "#ededed",
Succeeded: "#3f9c35",
Terminating: "#00659c",
Unknown: "#f9d67a"
},
selection: {
enabled: !1
}
}
}, e.mini && (d.padding = {
top: 0,
right: 0,
bottom: 0,
left: 0
});
var p = _.debounce(function(t) {
var n = {
columns: []
};
angular.forEach(m, function(e) {
n.columns.push([ e, t[e] || 0 ]);
}), _.isEmpty(t) ? n.columns.push([ "Empty", 1 ]) : n.unload = "Empty", u ? u.load(n) : (d.data.columns = n.columns, u = c3.generate(d)), e.podStatusData = n.columns;
}, 350, {
maxWait: 500
});
e.$watch(function() {
var t = {};
return angular.forEach(e.pods, function(e) {
var n = l(e);
t[n] = (t[n] || 0) + 1;
}), t;
}, p, !0), e.$watchGroup([ "desired", "idled" ], s), e.$on("destroy", function() {
u && (u = u.destroy());
});
}
};
} ]), angular.module("openshiftConsole").directive("routeServicePie", function() {
return {
restrict: "E",
scope: {
route: "="
},
template: '<div ng-show="totalWeight" ng-attr-id="{{chartId}}"></div>',
link: function(e) {
var t, n, a = window.matchMedia("(max-width: 400px)").matches;
e.chartId = _.uniqueId("route-service-chart-"), n = {
bindto: "#" + e.chartId,
color: {
pattern: [ $.pfPaletteColors.blue, $.pfPaletteColors.orange, $.pfPaletteColors.green, $.pfPaletteColors.red ]
},
legend: {
show: !0,
position: a ? "bottom" : "right"
},
pie: {
label: {
show: !1
}
},
size: {
height: a ? 150 : 115
},
tooltip: {
format: {
name: function(e, t, n) {
return n;
}
}
},
data: {
type: "pie",
order: null,
selection: {
enabled: !1
}
}
};
var r, o = function(e) {
return [ e.name, e.weight ];
}, i = function(e) {
return _.head(e);
}, s = function(e) {
var t = {};
_.each(e.columns, function(e) {
var n = i(e);
t[n] = !0;
});
var n = _.get(r, "columns", []);
e.unload = _.chain(n).reject(function(e) {
var n = i(e);
return _.has(t, [ n ]);
}).map(i).value();
};
e.$watch("route", function() {
var a = {
columns: [],
names: {}
};
e.route && (a.columns.push(o(e.route.spec.to)), a.names[e.route.spec.to.name] = _.truncate(e.route.spec.to.name, {
length: 30
}), e.totalWeight = e.route.spec.to.weight, _.each(e.route.spec.alternateBackends, function(t) {
a.columns.push(o(t)), a.names[t.name] = _.truncate(t.name, {
length: 30
}), e.totalWeight += t.weight;
})), e.totalWeight && (t ? (s(a), t.load(a)) : (n.data.columns = a.columns, t = c3.generate(n)), r = a);
}), e.$on("destroy", function() {
t && (t = t.destroy());
});
}
};
}), angular.module("openshiftConsole").directive("deploymentDonut", [ "$filter", "$location", "$timeout", "$uibModal", "DeploymentsService", "HPAService", "QuotaService", "LabelFilter", "Navigate", "NotificationsService", "hashSizeFilter", "hasDeploymentConfigFilter", function(e, t, n, a, r, o, i, s, c, l, u, d) {
return {
restrict: "E",
scope: {
rc: "=",
deploymentConfig: "=",
deployment: "=",
scalable: "=",
hpa: "=?",
limitRanges: "=",
quotas: "=",
clusterQuotas: "=",
project: "=",
pods: "="
},
templateUrl: "views/directives/deployment-donut.html",
controller: [ "$scope", "$filter", "$q", function(e, t, n) {
var s = !1, u = t("humanizeKind");
e.$watch("rc.spec.replicas", function() {
s || (e.desiredReplicas = null);
});
var m = function() {
o.getHPAWarnings(e.rc, e.hpa, e.limitRanges, e.project).then(function(t) {
e.hpaWarnings = _.map(t, function(e) {
return _.escape(e.message);
}).join("<br>");
});
};
e.$watchGroup([ "limitRanges", "hpa", "project" ], m), e.$watch("rc.spec.template.spec.containers", m, !0);
e.$watchGroup([ "rc.spec.replicas", "rc.status.replicas", "quotas", "clusterQuotas" ], function() {
if (_.get(e.rc, "spec.replicas", 1) > _.get(e.rc, "status.replicas", 0)) {
var t = i.filterQuotasForResource(e.rc, e.quotas), n = i.filterQuotasForResource(e.rc, e.clusterQuotas), a = function(t) {
return !_.isEmpty(i.getResourceLimitAlerts(e.rc, t));
};
e.showQuotaWarning = _.some(t, a) || _.some(n, a);
} else e.showQuotaWarning = !1;
});
var p = function() {
return e.deploymentConfig || e.deployment || e.rc;
}, g = function() {
if (s = !1, angular.isNumber(e.desiredReplicas)) {
var a = p();
return r.scale(a, e.desiredReplicas).then(_.noop, function(e) {
var r = u(a.kind);
return l.addNotification({
id: "deployment-scale-error",
type: "error",
message: "An error occurred scaling " + r + " " + a.metadata.name + ".",
details: t("getErrorDetails")(e)
}), n.reject(e);
});
}
}, f = _.debounce(g, 650);
e.viewPodsForDeployment = function(t) {
_.isEmpty(e.pods) || c.toPodsForDeployment(t, e.pods);
}, e.scaleUp = function() {
e.scalable && (e.desiredReplicas = e.getDesiredReplicas(), e.desiredReplicas++, f(), s = !0);
}, e.scaleDown = function() {
e.scalable && (e.desiredReplicas = e.getDesiredReplicas(), 0 !== e.desiredReplicas && (1 !== e.desiredReplicas ? (e.desiredReplicas--, f()) : a.open({
templateUrl: "views/modals/confirmScale.html",
controller: "ConfirmScaleController",
resolve: {
resource: function() {
return e.rc;
},
type: function() {
return d(e.rc) ? "deployment" : "replication controller";
}
}
}).result.then(function() {
e.desiredReplicas = e.getDesiredReplicas() - 1, f(), s = !0;
})));
}, e.getDesiredReplicas = function() {
return angular.isDefined(e.desiredReplicas) && null !== e.desiredReplicas ? e.desiredReplicas : e.rc && e.rc.spec && angular.isDefined(e.rc.spec.replicas) ? e.rc.spec.replicas : 1;
}, e.$watch(function() {
return !_.get(e.rc, "spec.replicas") && !!(e.deploymentConfig ? t("annotation")(e.deploymentConfig, "idledAt") : t("annotation")(e.rc, "idledAt"));
}, function(t) {
e.isIdled = !!t;
}), e.unIdle = function() {
e.desiredReplicas = t("unidleTargetReplicas")(e.deploymentConfig || e.rc, e.hpa), g().then(function() {
e.isIdled = !1;
});
};
} ]
};
} ]), angular.module("openshiftConsole").directive("quotaUsageChart", [ "$filter", "ChartsService", function(e, t) {
return {
restrict: "E",
scope: {
used: "=",
crossProjectUsed: "=?",
total: "=",
type: "@",
height: "=?",
width: "=?"
},
replace: !0,
templateUrl: "views/_quota-usage-chart.html",
link: function(n, a) {
var r = e("usageValue"), o = e("usageWithUnits"), i = e("amountAndUnit");
n.height = n.height || 200, n.width = n.width || 175;
var s = function(e) {
return e ? (100 * Number(e)).toFixed(1) + "%" : "0%";
};
n.chartID = _.uniqueId("quota-usage-chart-");
var c, l = {
type: "donut",
bindto: "#" + n.chartID,
donut: {
label: {
show: !1
},
width: 10
},
size: {
height: n.height,
width: n.width
},
legend: {
show: !0,
position: n.legendPosition || "bottom",
item: {
onclick: _.noop
}
},
onrendered: function() {
_.spread(function(e, n) {
t.updateDonutCenterText(a[0], e, n);
})(i(n.total, n.type, !0));
},
tooltip: {
position: function() {
return {
top: 0,
left: 0
};
},
contents: function(e, t, a, i) {
var c = $('<table class="c3-tooltip"></table>').css({
width: n.width + "px"
}), l = $("<tr/>").appendTo(c), u = $('<td class="name nowrap"></td>').appendTo(l);
$("<span/>").css({
"background-color": i(e[0].id)
}).appendTo(u), $("<span/>").text(e[0].name).appendTo(u);
var d;
d = n.total ? s(e[0].value / r(n.total)) + " of " + o(n.total, n.type) : o(n.used, n.type);
var m = $("<tr/>").appendTo(c);
return $('<td class="value" style="text-align: left;"></td>').text(d).appendTo(m), c.get(0).outerHTML;
}
},
data: {
type: "donut",
order: null
}
};
n.$watchGroup([ "used", "total", "crossProjectUsed" ], _.debounce(function() {
var e = void 0 !== n.crossProjectUsed, t = r(n.used) || 0, a = Math.max((r(n.crossProjectUsed) || 0) - t, 0), o = Math.max(r(n.total) - (a + t), 0), i = {
columns: [ [ "used", t ], [ "available", o ] ],
colors: {
used: o ? "#0088ce" : "#ec7a08",
other: o ? "#7dc3e8" : "#f7bd7f",
available: "#d1d1d1"
},
names: {
used: e ? "Used - This Project" : "Used",
other: "Used - Other Projects",
available: "Available"
}
};
e && i.columns.splice(1, 0, [ "other", a ]), c ? c.load(i) : (_.assign(l.data, i), c = c3.generate(l));
}, 300));
}
};
} ]), angular.module("openshiftConsole").directive("buildTrendsChart", [ "$filter", "$location", "$rootScope", "$timeout", "BuildsService", function(e, t, n, a, r) {
return {
restrict: "E",
scope: {
builds: "="
},
templateUrl: "views/_build-trends-chart.html",
link: function(o) {
var i, s = [ "Complete", "Failed", "Cancelled", "Error" ];
o.minBuilds = _.constant(4);
var c = function(e) {
var t = [], n = moment.duration(e), a = Math.floor(n.asHours()), r = n.minutes(), o = n.seconds();
return a || r || o ? (a && t.push(a + "h"), r && t.push(r + "m"), a || t.push(o + "s"), t.join(" ")) : "";
};
o.chartID = _.uniqueId("build-trends-chart-");
var l, u, d = _.constant(350), m = {
bindto: "#" + o.chartID,
padding: {
right: 30,
left: 80
},
axis: {
x: {
fit: !0,
label: {
text: "Build Number",
position: "outer-right"
},
tick: {
culling: !0,
format: function(e) {
return "#" + i.json[e].buildNumber;
},
width: 30
},
type: "category"
},
y: {
label: {
text: "Duration",
position: "outer-top"
},
min: 0,
padding: {
bottom: 0
},
tick: {
format: c
}
}
},
bar: {
width: {
max: 50
}
},
legend: {
item: {
onclick: _.noop
}
},
size: {
height: 250
},
tooltip: {
format: {
title: function(e) {
var t = i.json[e], n = r.getStartTimestsamp(t.build);
return "#" + t.buildNumber + " (" + moment(n).fromNow() + ")";
}
}
},
transition: {
duration: d()
},
data: {
colors: {
Cancelled: "#d1d1d1",
Complete: "#00b9e4",
Error: "#393f44",
Failed: "#cc0000"
},
empty: {
label: {
text: "No Completed Builds"
}
},
onclick: function(a) {
var r = i.json[a.x].build, o = e("navigateResourceURL")(r);
o && n.$apply(function() {
t.path(o);
});
},
selection: {
enabled: !0
},
order: null,
type: "bar"
}
}, p = function() {
o.completeBuilds = [];
var t = e("isIncompleteBuild");
angular.forEach(o.builds, function(e) {
t(e) || o.completeBuilds.push(e);
});
}, g = !1, f = function() {
u && g ? l.ygrids([ {
value: u,
class: "build-trends-avg-line"
} ]) : l.ygrids.remove();
};
o.toggleAvgLine = function() {
g = !g, f();
};
o.$watch(function() {
return p(), o.completeBuilds.length;
}, function() {
i = {
json: [],
keys: {
x: "buildNumber"
}
};
var e = 0, t = 0;
angular.forEach(o.completeBuilds, function(n) {
var a = r.getBuildNumber(n);
if (a) {
var o = r.getDuration(n);
e += o, t++;
var s = {
buildNumber: a,
phase: n.status.phase,
build: n
};
s[n.status.phase] = o, i.json.push(s);
}
}), i.json.sort(function(e, t) {
return e.buildNumber - t.buildNumber;
}), i.json.length > 50 && (i.json = i.json.slice(i.json.length - 50));
var n = {};
angular.forEach(i.json, function(e) {
n[e.phase] = !0;
}), t ? (u = e / t, o.averageDurationText = c(u)) : (u = null, o.averageDurationText = null);
var p = [], g = [];
angular.forEach(s, function(e) {
n[e] ? p.push(e) : g.push(e);
}), i.keys.value = p, i.groups = [ p ], l ? (i.unload = g, i.done = function() {
setTimeout(function() {
l.flush();
}, d() + 25);
}, l.load(i), f()) : (m.data = angular.extend(i, m.data), a(function() {
l = c3.generate(m), f();
}));
}), o.$on("destroy", function() {
l && (l = l.destroy());
});
}
};
} ]), angular.module("openshiftConsole").directive("computeResource", [ "$filter", function(e) {
return {
restrict: "E",
require: "ngModel",
scope: {
label: "@",
type: "@",
description: "@",
defaultValue: "=",
limitRangeMin: "=",
limitRangeMax: "=",
maxLimitRequestRatio: "=",
request: "="
},
templateUrl: "views/_compute-resource.html",
link: function(t, n, a, r) {
var o = e("usageValue"), i = e("amountAndUnit"), s = e("humanizeUnit");
t.id = _.uniqueId("compute-resource-"), t.input = {};
var c = function(e) {
_.some(t.units, {
value: e
}) || t.units.push({
value: e,
label: s(e, t.type)
});
};
switch (t.$watch("defaultValue", function(e) {
var n = _.spread(function(e, n) {
t.placeholder = e, c(n), t.input.amount || (t.input.unit = n);
});
e && n(i(e, t.type));
}), t.type) {
case "cpu":
t.input.unit = "m", t.units = [ {
value: "m",
label: "millicores"
}, {
value: "",
label: "cores"
} ];
break;

case "memory":
t.input.unit = "Mi", t.units = [ {
value: "Mi",
label: "MiB"
}, {
value: "Gi",
label: "GiB"
}, {
value: "M",
label: "MB"
}, {
value: "G",
label: "GB"
} ];
}
t.groupUnits = function(e) {
switch (e.value) {
case "Mi":
case "Gi":
return "Binary Units";

case "M":
case "G":
return "Decimal Units";
}
return "";
};
var l = function() {
var e = t.input.amount && o(t.input.amount + t.input.unit), n = t.limitRangeMin && o(t.limitRangeMin), a = t.limitRangeMax && o(t.limitRangeMax), r = !0, i = !0;
e && n && (r = e >= n), e && a && (i = e <= a), t.form.amount.$setValidity("limitRangeMin", r), t.form.amount.$setValidity("limitRangeMax", i);
}, u = function() {
var e, n = t.request && o(t.request), a = !0, r = !0;
t.input.amount ? e = o(t.input.amount + t.input.unit) : t.defaultValue && (e = o(t.defaultValue)), n && e && (a = e >= n, t.maxLimitRequestRatio && (r = e / n <= t.maxLimitRequestRatio)), n && !e && t.maxLimitRequestRatio && (r = !1), t.form.amount.$setValidity("limitLargerThanRequest", a), t.form.amount.$setValidity("limitWithinRatio", r);
};
r.$render = function() {
_.spread(function(e, n) {
e ? (t.input.amount = Number(e), t.input.unit = n, c(n)) : t.input.amount = null;
})(i(r.$viewValue, t.type));
}, t.$watchGroup([ "input.amount", "input.unit" ], function() {
l(), u(), t.input.amount ? r.$setViewValue(t.input.amount + t.input.unit) : r.$setViewValue(void 0);
}), t.$watchGroup([ "limitRangeMin", "limitRangeMax" ], l), t.$watch("request", u);
}
};
} ]).directive("editRequestLimit", [ "$filter", "LimitRangesService", "ModalsService", function(e, t, n) {
return {
restrict: "E",
scope: {
resources: "=",
type: "@",
limitRanges: "=",
project: "="
},
templateUrl: "views/_edit-request-limit.html",
link: function(e) {
e.showComputeUnitsHelp = function() {
n.showComputeUnitsHelp();
}, e.$watch("limitRanges", function() {
e.limits = t.getEffectiveLimitRange(e.limitRanges, e.type, "Container", e.project), e.requestCalculated = t.isRequestCalculated(e.type, e.project), e.limitCalculated = t.isLimitCalculated(e.type, e.project);
}, !0);
}
};
} ]), angular.module("openshiftConsole").directive("editProbe", function() {
return {
restrict: "E",
scope: {
probe: "=",
exposedPorts: "="
},
templateUrl: "views/directives/_edit-probe.html",
link: function(e) {
e.id = _.uniqueId("edit-probe-"), e.probe = e.probe || {}, e.types = [ {
id: "httpGet",
label: "HTTP GET"
}, {
id: "exec",
label: "Container Command"
}, {
id: "tcpSocket",
label: "TCP Socket"
} ], e.previousProbes = {}, e.tcpPorts = _.filter(e.exposedPorts, {
protocol: "TCP"
});
var t = _.get(e, "probe.httpGet.port") || _.get(e, "probe.exec.port");
t && !_.some(e.tcpPorts, {
containerPort: t
}) && (e.tcpPorts = [ {
containerPort: t,
protocol: "TCP"
} ].concat(e.tcpPorts)), e.portOptions = e.tcpPorts;
var n, a = function(t, n) {
if (e.probe = e.probe || {}, e.previousProbes[n] = e.probe[n], delete e.probe[n], e.probe[t] = e.previousProbes[t], !e.probe[t]) switch (t) {
case "httpGet":
case "tcpSocket":
var a = _.head(e.tcpPorts);
e.probe[t] = {
port: a ? a.containerPort : ""
};
break;

case "exec":
e.probe = {
exec: {
command: []
}
};
}
};
e.probe.httpGet ? n = "httpGet" : e.probe.exec ? n = "exec" : e.probe.tcpSocket ? n = "tcpSocket" : (n = "httpGet", a("httpGet")), _.set(e, "selected.type", n), e.$watch("selected.type", function(e, t) {
e !== t && a(e, t);
}), e.refreshPorts = function(t) {
if (/^\d+$/.test(t)) {
var n = e.tcpPorts;
(t = parseInt(t, 10)) && !_.some(n, {
containerPort: t
}) && (n = [ {
containerPort: t,
protocol: "TCP"
} ].concat(n)), e.portOptions = _.uniq(n);
}
};
}
};
}), angular.module("openshiftConsole").directive("editCommand", [ "$filter", function(e) {
return {
restrict: "E",
scope: {
args: "=",
type: "@",
placeholder: "@",
description: "=",
isRequired: "="
},
templateUrl: "views/directives/_edit-command.html",
link: function(t) {
t.id = _.uniqueId("edit-command-"), t.input = {};
var n, a, r = e("isMultiline");
t.$watch("args", function() {
a ? a = !1 : _.isEmpty(t.args) || (t.input.args = _.map(t.args, function(e) {
return {
value: e,
multiline: r(e)
};
}), n = !0);
}, !0), t.$watch("input.args", function(e, r) {
n ? n = !1 : e !== r && (a = !0, t.args = _.map(t.input.args, function(e) {
return e.value;
}), t.form.command.$setDirty());
}, !0), t.addArg = function() {
t.nextArg && (t.input.args = t.input.args || [], t.input.args.push({
value: t.nextArg,
multiline: r(t.nextArg)
}), t.nextArg = "");
}, t.removeArg = function(e) {
t.input.args.splice(e, 1), _.isEmpty(t.input.args) && (t.input.args = null);
}, t.clear = function() {
t.input.args = null;
};
}
};
} ]), angular.module("openshiftConsole").directive("buildPipeline", [ "$filter", "APIService", "Logger", function(e, t, n) {
return {
restrict: "E",
scope: {
build: "=",
expandOnlyRunning: "=?",
collapsePending: "=?",
buildConfigNameOnExpanded: "=?"
},
replace: !0,
templateUrl: "views/directives/build-pipeline.html",
link: function(a) {
a.buildLogsVersion = t.getPreferredVersion("builds/log");
var r = e("annotation");
a.$watch(function() {
return r(a.build, "jenkinsStatus");
}, function(e) {
if (e) try {
a.jenkinsStatus = JSON.parse(e);
} catch (t) {
n.error("Could not parse Jenkins status as JSON", e);
}
});
var o = e("buildConfigForBuild");
a.$watch(function() {
return o(a.build);
}, function(e) {
a.buildConfigName = e;
});
}
};
} ]).directive("pipelineStatus", function() {
return {
restrict: "E",
scope: {
status: "="
},
templateUrl: "views/directives/pipeline-status.html"
};
}), angular.module("openshiftConsole").directive("buildStatus", function() {
return {
restrict: "E",
scope: {
build: "="
},
templateUrl: "views/directives/build-status.html"
};
}), function() {
angular.module("openshiftConsole").component("routeServiceBarChart", {
controller: function() {
var e = this, t = function(t, n) {
return t.name === e.highlightService ? -1 : n.name === e.highlightService ? 1 : n.weight === t.weight ? t.name.localeCompare(n.name) : n.weight - t.weight;
}, n = function(t) {
e.total += t.weight, e.max = Math.max(t.weight, e.max || 0), e.backends.push({
name: t.name,
weight: t.weight
});
};
e.$onChanges = function() {
if (e.backends = [], e.total = 0, e.route) {
n(e.route.spec.to);
var a = _.get(e, "route.spec.alternateBackends", []);
_.each(a, n), e.backends.sort(t);
}
}, e.getPercentage = function(t) {
var n = e.total || 100, a = t.weight / n * 100;
return _.round(a) + "%";
}, e.barWidth = function(t) {
var n = e.max || 100;
return t.weight / n * 100 + "%";
};
},
controllerAs: "routeServices",
bindings: {
route: "<",
highlightService: "<"
},
templateUrl: "views/directives/route-service-bar-chart.html"
});
}(), function() {
angular.module("openshiftConsole").component("bindService", {
controller: [ "$scope", "$filter", "APIService", "ApplicationsService", "BindingService", "Catalog", "DataService", "ServiceInstancesService", function(e, t, n, a, r, o, i, s) {
var c, l, u, d, m, p, g = this, f = t("statusCondition"), h = t("enableTechPreviewFeature"), v = n.getPreferredVersion("serviceinstances"), y = n.getPreferredVersion("clusterserviceclasses"), b = n.getPreferredVersion("clusterserviceplans"), S = function() {
var e, t;
_.each(g.serviceInstances, function(n) {
var a = "True" === _.get(f(n, "Ready"), "status");
a && (!e || n.metadata.creationTimestamp > e.metadata.creationTimestamp) && (e = n), a || t && !(n.metadata.creationTimestamp > t.metadata.creationTimestamp) || (t = n);
}), g.serviceToBind = e || t;
}, C = function() {
g.serviceClasses && g.serviceInstances && g.servicePlans && (g.serviceInstances = r.filterBindableServiceInstances(g.serviceInstances, g.serviceClasses, g.servicePlans), g.orderedServiceInstances = r.sortServiceInstances(g.serviceInstances, g.serviceClasses), g.serviceToBind || S());
}, w = function() {
var e = {
namespace: _.get(g.target, "metadata.namespace")
};
a.getApplications(e).then(function(e) {
g.applications = e, g.bindType = g.applications.length ? "application" : "secret-only";
});
}, P = function() {
var e = {
namespace: _.get(g.target, "metadata.namespace")
};
i.list(v, e).then(function(e) {
g.serviceInstances = e.by("metadata.name"), C();
}), i.list(y, {}).then(function(e) {
g.serviceClasses = e.by("metadata.name"), C();
}), i.list(b, {}).then(function(e) {
g.servicePlans = e.by("metadata.name"), C();
});
};
c = {
id: "bindForm",
label: "绑定",
view: "views/directives/bind-service/bind-service-form.html",
valid: !1,
allowClickNav: !0,
onShow: function() {
g.nextTitle = l.hidden ? "绑定" : "下一页", g.podPresets && !d && (d = e.$watch("ctrl.selectionForm.$valid", function(e) {
c.valid = e;
}));
}
}, l = {
id: "bindParameters",
label: "参数",
view: "views/directives/bind-service/bind-parameters.html",
hidden: !0,
allowClickNav: !0,
onShow: function() {
g.nextTitle = "绑定", m || (m = e.$watch("ctrl.parametersForm.$valid", function(e) {
l.valid = e;
}));
}
}, u = {
id: "results",
label: "结果",
view: "views/directives/bind-service/results.html",
valid: !0,
allowClickNav: !1,
onShow: function() {
d && (d(), d = void 0), m && (m(), m = void 0), g.nextTitle = "关闭", g.wizardComplete = !0, g.bindService();
}
};
e.$watch("ctrl.serviceToBind", function() {
g.serviceToBind && s.fetchServiceClassForInstance(g.serviceToBind).then(function(e) {
g.serviceClass = e;
var t = s.getServicePlanNameForInstance(g.serviceToBind);
i.get(b, t, {}).then(function(e) {
g.plan = e, g.parameterSchema = _.get(g.plan, "spec.serviceBindingCreateParameterSchema"), g.parameterFormDefinition = _.get(g.plan, "spec.externalMetadata.schemas.service_binding.create.openshift_form_definition"), l.hidden = !_.has(g.parameterSchema, "properties"), g.nextTitle = l.hidden ? "绑定" : "下一页", g.hideBack = l.hidden, c.valid = !0;
});
});
}), g.$onInit = function() {
g.serviceSelection = {}, g.projectDisplayName = t("displayName")(g.project), g.podPresets = h("pod_presets"), g.parameterData = {}, g.steps = [ c, l, u ], g.hideBack = l.hidden, "ServiceInstance" === g.target.kind ? (g.bindType = "secret-only", g.appToBind = null, g.serviceToBind = g.target, g.podPresets && w()) : (g.bindType = "application", g.appToBind = g.target, P());
}, g.$onChanges = function(e) {
e.project && !e.project.isFirstChange() && (g.projectDisplayName = t("displayName")(g.project));
}, g.$onDestroy = function() {
d && (d(), d = void 0), m && (m(), m = void 0), p && i.unwatch(p);
}, g.bindService = function() {
var e = "ServiceInstance" === g.target.kind ? g.target : g.serviceToBind, t = "application" === g.bindType ? g.appToBind : void 0, n = {
namespace: _.get(e, "metadata.namespace")
}, a = r.getServiceClassForInstance(e, g.serviceClasses);
r.bindService(e, t, a, g.parameterData).then(function(e) {
g.binding = e, g.error = null, p = i.watchObject(r.bindingResource, _.get(g.binding, "metadata.name"), n, function(e) {
g.binding = e;
});
}, function(e) {
g.error = e;
});
}, g.closeWizard = function() {
_.isFunction(g.onClose) && g.onClose();
};
} ],
controllerAs: "ctrl",
bindings: {
target: "<",
project: "<",
onClose: "<"
},
templateUrl: "views/directives/bind-service.html"
});
}(), function() {
angular.module("openshiftConsole").component("unbindService", {
controller: [ "$scope", "$filter", "APIService", "DataService", function(e, t, n, a) {
var r, o, i = this, s = t("enableTechPreviewFeature"), c = t("serviceInstanceDisplayName"), l = n.getPreferredVersion("servicebindings"), u = function() {
var e = i.selectedBinding.metadata.name;
i.unboundApps = i.appsForBinding(e), a.delete(l, e, o, {
propagationPolicy: null
}).then(_.noop, function(e) {
i.error = e;
});
}, d = function() {
var t = _.head(i.steps);
t.valid = !1, r = e.$watch("ctrl.selectedBinding", function(e) {
t.valid = !!e;
});
}, m = function() {
r && (r(), r = void 0);
}, p = function() {
i.nextTitle = "Delete", d();
}, g = function() {
i.nextTitle = "Close", i.wizardComplete = !0, u(), m();
};
i.$onInit = function() {
var e;
e = "ServiceInstance" === i.target.kind ? s("pod_presets") ? "Applications" : "Bindings" : "Services", i.displayName = c(i.target, i.serviceClass), i.steps = [ {
id: "deleteForm",
label: e,
view: "views/directives/bind-service/delete-binding-select-form.html",
onShow: p
}, {
id: "results",
label: "Results",
view: "views/directives/bind-service/delete-binding-result.html",
onShow: g
} ], o = {
namespace: _.get(i.target, "metadata.namespace")
};
}, i.appsForBinding = function(e) {
return _.get(i.applicationsByBinding, e);
}, i.closeWizard = function() {
_.isFunction(i.onClose) && i.onClose();
}, i.$onDestroy = function() {
m();
};
} ],
controllerAs: "ctrl",
bindings: {
target: "<",
bindings: "<",
applicationsByBinding: "<",
onClose: "<",
serviceClass: "<"
},
templateUrl: "views/directives/unbind-service.html"
});
}(), function() {
angular.module("openshiftConsole").component("processTemplate", {
controller: [ "$filter", "$q", "$scope", "$uibModal", "APIService", "DataService", "Navigate", "NotificationsService", "ProcessedTemplateService", "ProjectsService", "QuotaService", "SecurityCheckService", "TaskList", "keyValueEditorUtils", function(e, t, n, a, r, o, i, s, c, l, u, d, m, p) {
function g(e) {
var t = /^helplink\.(.*)\.title$/, n = /^helplink\.(.*)\.url$/, a = {};
for (var r in e.annotations) {
var o, i = r.match(t);
i ? ((o = a[i[1]] || {}).title = e.annotations[r], a[i[1]] = o) : (i = r.match(n)) && ((o = a[i[1]] || {}).url = e.annotations[r], a[i[1]] = o);
}
return a;
}
function f() {
v.prefillParameters && _.each(v.template.parameters, function(e) {
v.prefillParameters[e.name] && (e.value = v.prefillParameters[e.name]);
}), v.labels = _.map(v.template.labels, function(e, t) {
return {
name: t,
value: e
};
}), T() && v.labels.push({
name: "app",
value: v.template.metadata.name
});
}
var h, v = this, y = e("displayName"), b = e("humanize");
v.noProjectsCantCreate = !1, v.$onInit = function() {
v.labels = [], v.template = angular.copy(v.template), v.templateDisplayName = y(v.template), v.selectedProject = v.project, n.$watch("$ctrl.selectedProject.metadata.name", function() {
v.projectNameTaken = !1;
}), n.$on("no-projects-cannot-create", function() {
v.noProjectsCantCreate = !0;
}), f();
};
var S, C = function() {
var e = {
started: "Creating " + v.templateDisplayName + " in project " + y(v.selectedProject),
success: "Created " + v.templateDisplayName + " in project " + y(v.selectedProject),
failure: "Failed to create " + v.templateDisplayName + " in project " + y(v.selectedProject)
}, a = g(v.template);
m.clear(), m.add(e, a, v.selectedProject.metadata.name, function() {
var e = t.defer();
return o.batch(S, h).then(function(t) {
var n = [], a = !1;
t.failure.length > 0 ? (a = !0, t.failure.forEach(function(e) {
n.push({
type: "error",
message: "Cannot create " + b(e.object.kind).toLowerCase() + ' "' + e.object.metadata.name + '". ',
details: e.data.message
});
}), t.success.forEach(function(e) {
n.push({
type: "success",
message: "Created " + b(e.kind).toLowerCase() + ' "' + e.metadata.name + '" successfully. '
});
})) : n.push({
type: "success",
message: "All items in template " + v.templateDisplayName + " were created successfully."
}), e.resolve({
alerts: n,
hasErrors: a
});
}), e.promise;
}), v.isDialog ? n.$emit("templateInstantiated", {
project: v.selectedProject,
template: v.template
}) : i.toNextSteps(v.templateDisplayName, v.selectedProject.metadata.name);
}, w = function(e) {
a.open({
templateUrl: "views/modals/confirm.html",
controller: "ConfirmModalController",
resolve: {
modalConfig: function() {
return {
alerts: e,
title: "Confirm Creation",
details: "We checked your application for potential problems. Please confirm you still want to create this application.",
okButtonText: "Create Anyway",
okButtonClass: "btn-danger",
cancelButtonText: "Cancel"
};
}
}
}).result.then(C);
}, P = {}, k = function() {
s.hideNotification("process-template-error"), _.each(P, function(e) {
!e.id || "error" !== e.type && "warning" !== e.type || s.hideNotification(e.id);
});
}, j = function(e) {
k(), P = d.getSecurityAlerts(S, v.selectedProject.metadata.name);
var t = e.quotaAlerts || [];
P = P.concat(t), _.filter(P, {
type: "error"
}).length ? (v.disableInputs = !1, _.each(P, function(e) {
e.id = _.uniqueId("process-template-alert-"), s.addNotification(e);
})) : P.length ? (w(P), v.disableInputs = !1) : C();
}, R = function() {
if (_.has(v.selectedProject, "metadata.uid")) return t.when(v.selectedProject);
var n = v.selectedProject.metadata.name, a = v.selectedProject.metadata.annotations["new-display-name"], r = e("description")(v.selectedProject);
return l.create(n, a, r);
}, I = function(e) {
var t = r.objectToResourceGroupVersion(e);
return t.resource = "processedtemplates", t;
};
v.createFromTemplate = function() {
v.disableInputs = !0, R().then(function(e) {
v.selectedProject = e, h = {
namespace: v.selectedProject.metadata.name
}, v.template.labels = p.mapEntries(p.compactEntries(v.labels));
var t = I(v.template);
o.create(t, null, v.template, h).then(function(e) {
c.setTemplateData(e.parameters, v.template.parameters, e.message), S = e.objects, u.getLatestQuotaAlerts(S, h).then(j);
}, function(e) {
v.disableInputs = !1;
var t;
e.data && e.data.message && (t = e.data.message), s.addNotification({
id: "process-template-error",
type: "error",
message: "An error occurred processing the template.",
details: t
});
});
}, function(e) {
if (v.disableInputs = !1, "AlreadyExists" === e.data.reason) v.projectNameTaken = !0; else {
var t;
e.data && e.data.message && (t = e.data.message), s.addNotification({
id: "process-template-error",
type: "error",
message: "An error occurred creating the project.",
details: t
});
}
});
}, v.cancel = function() {
k(), i.toProjectOverview(v.project.metadata.name);
}, n.$on("instantiateTemplate", v.createFromTemplate), n.$on("$destroy", k);
var T = function() {
return !_.get(v.template, "labels.app") && !_.some(v.template.objects, "metadata.labels.app");
};
} ],
controllerAs: "$ctrl",
bindings: {
template: "<",
project: "<",
onProjectSelected: "<",
availableProjects: "<",
prefillParameters: "<",
isDialog: "<"
},
templateUrl: "views/directives/process-template.html"
});
}(), function() {
angular.module("openshiftConsole").component("processTemplateDialog", {
controller: [ "$scope", "$filter", "$routeParams", "Catalog", "DataService", "KeywordService", "NotificationsService", "ProjectsService", "RecentlyViewedProjectsService", function(e, t, n, a, r, o, i, s, c) {
function l() {
return w(_.get(b, "template.metadata.annotations.iconClass", "fa fa-clone"));
}
function u() {
var e = _.get(b, "template.metadata.annotations.iconClass", "fa fa-clone");
return S(e);
}
function d() {
b.steps || (b.steps = [ b.selectStep, b.infoStep, b.configStep, b.resultsStep ]);
}
function m() {
y && (y(), y = void 0);
}
function p() {
e.$broadcast("instantiateTemplate");
}
function g(e, t) {
return o.filterForKeywords(t, [ "name", "tags" ], o.generateKeywords(e));
}
function f(e) {
b.filterConfig.appliedFilters = e, h();
}
function h() {
b.filteredItems = b.catalogItems, b.filterConfig.appliedFilters && b.filterConfig.appliedFilters.length > 0 && _.each(b.filterConfig.appliedFilters, function(e) {
b.filteredItems = g(e.value, b.filteredItems);
}), b.filterConfig.resultsCount = b.filteredItems.length, _.includes(b.filteredItems, b.selectedTemplate) || b.templateSelected();
}
function v() {
b.unfilteredProjects || s.list().then(function(e) {
b.unfilteredProjects = _.toArray(e.by("metadata.name"));
}, function() {
b.unfilteredProjects = [];
}).finally(function() {
P();
});
}
var y, b = this, S = t("imageForIconClass"), C = t("annotation"), w = t("normalizeIconClass");
b.selectStep = {
id: "projectTemplates",
label: "选择",
view: "views/directives/process-template-dialog/process-template-select.html",
hidden: !0 !== b.useProjectTemplate,
allowed: !0,
valid: !1,
allowClickNav: !0,
onShow: function() {
b.infoStep.selected = !1, b.selectStep.selected = !0, b.configStep.selected = !1, b.resultsStep.selected = !1, b.nextTitle = "下一步", m(), v();
}
}, b.infoStep = {
id: "info",
label: "信息",
view: "views/directives/process-template-dialog/process-template-info.html",
allowed: !0,
valid: !0,
allowClickNav: !0,
onShow: function() {
b.infoStep.selected = !0, b.selectStep.selected = !1, b.configStep.selected = !1, b.resultsStep.selected = !1, b.nextTitle = "下一步", m();
}
}, b.configStep = {
id: "configuration",
label: "配置",
view: "views/directives/process-template-dialog/process-template-config.html",
valid: !1,
allowed: !0,
allowClickNav: !0,
onShow: function() {
b.infoStep.selected = !1, b.selectStep.selected = !1, b.configStep.selected = !0, b.resultsStep.selected = !1, b.nextTitle = "创建", b.resultsStep.allowed = b.configStep.valid, y = e.$watch("$ctrl.form.$valid", function(e) {
b.configStep.valid = e && !b.noProjectsCantCreate && b.selectedProject, b.resultsStep.allowed = e;
});
}
}, b.resultsStep = {
id: "results",
label: "结果",
view: "views/directives/process-template-dialog/process-template-results.html",
valid: !0,
allowed: !1,
prevEnabled: !1,
allowClickNav: !1,
onShow: function() {
b.infoStep.selected = !1, b.selectStep.selected = !1, b.configStep.selected = !1, b.resultsStep.selected = !0, b.nextTitle = "关闭", m(), b.wizardDone = !0;
}
}, b.$onInit = function() {
b.loginBaseUrl = r.openshiftAPIBaseUrl(), b.preSelectedProject = b.selectedProject = b.project, b.useProjectTemplate && (b.project && (b.templateProject = b.project, b.templateProjectChange()), v()), b.noProjectsCantCreate = !1, e.$on("no-projects-cannot-create", function() {
b.noProjectsCantCreate = !0;
}), b.noProjectsEmptyState = {
title: "No Available Projects",
info: "There are no projects available from which to load templates."
}, b.projectEmptyState = {
title: "No Project Selected",
info: "Please select a project from the dropdown to load templates from that project."
}, b.templatesEmptyState = {
title: "No Templates",
info: "The selected project has no templates available to import."
}, b.filterConfig = {
fields: [ {
id: "keyword",
title: "Keyword",
placeholder: "Filter by Keyword",
filterType: "text"
} ],
inlineResults: !0,
showTotalCountResults: !0,
itemsLabel: "Item",
itemsLabelPlural: "Items",
resultsCount: 0,
appliedFilters: [],
onFilterChange: f
}, n.project || (b.showProjectName = !0);
}, b.$onChanges = function(e) {
e.template && b.template && (d(), b.iconClass = l(), b.image = u(), b.docUrl = C(b.template, "openshift.io/documentation-url"), b.supportUrl = C(b.template, "openshift.io/support-url"), b.vendor = C(b.template, "openshift.io/provider-display-name")), e.useProjectTemplate && d();
}, e.$on("templateInstantiated", function(e, t) {
b.selectedProject = t.project, b.currentStep = b.resultsStep.label;
}), b.$onDestroy = function() {
m();
}, b.next = function(e) {
return e.stepId === b.configStep.id ? (p(), !1) : e.stepId !== b.resultsStep.id || (b.close(), !1);
}, b.close = function() {
var e = b.onDialogClosed();
_.isFunction(e) && e();
}, b.onProjectSelected = function(t) {
b.selectedProject = t, b.configStep.valid = e.$ctrl.form.$valid && b.selectedProject;
}, b.templateSelected = function(e) {
b.selectedTemplate = e, b.template = _.get(e, "resource"), b.selectStep.valid = !!e, b.iconClass = l(), b.image = u(), b.docUrl = C(b.template, "openshift.io/documentation-url"), b.supportUrl = C(b.template, "openshift.io/support-url"), b.vendor = C(b.template, "openshift.io/provider-display-name");
}, b.templateProjectChange = function() {
b.templateProjectName = _.get(b.templateProject, "metadata.name"), b.catalogItems = {}, b.templateSelected(), a.getProjectCatalogItems(b.templateProjectName, !1, !0).then(_.spread(function(e, t) {
b.catalogItems = e, b.totalCount = b.catalogItems.length, f(), t && i.addNotification({
type: "error",
message: t
});
}));
}, b.groupChoicesBy = function(e) {
return c.isRecentlyViewed(e.metadata.uid) ? "Recently Viewed" : "Other Projects";
};
var P = function() {
var e = _.reject(b.unfilteredProjects, "metadata.deletionTimestamp"), n = _.sortBy(e, t("displayName"));
b.searchEnabled = !_.isEmpty(e), b.templateProjects = c.orderByMostRecentlyViewed(n), b.numTemplateProjects = _.size(b.templateProjects), 1 === b.numTemplateProjects && (b.templateProject = _.head(b.templateProjects), b.templateProjectChange());
};
} ],
controllerAs: "$ctrl",
bindings: {
template: "<",
project: "<",
useProjectTemplate: "<",
onDialogClosed: "&"
},
templateUrl: "views/directives/process-template-dialog.html"
});
}(), function() {
angular.module("openshiftConsole").component("deployImageDialog", {
controller: [ "$scope", "$routeParams", "DataService", function(e, t, n) {
var a = this;
a.$onInit = function() {
a.loginBaseUrl = n.openshiftAPIBaseUrl(), a.currentStep = "Image", t.project || (a.showProjectName = !0), e.$on("no-projects-cannot-create", function() {
a.deployForm.$setValidity("required", !1), a.deployImageNewAppCreated = !1;
});
}, a.deployImage = function() {
e.$broadcast("newAppFromDeployImage");
}, e.$on("deployImageNewAppCreated", function(e, t) {
a.selectedProject = t.project, a.appName = t.appName, a.deployImageNewAppCreated = !0, a.currentStep = "Results";
}), a.close = function() {
var e = a.onDialogClosed();
return _.isFunction(e) && e(), a.wizardDone = !1, !0;
}, a.stepChanged = function(e) {
"results" === e.stepId ? (a.nextButtonTitle = "Close", a.wizardDone = !0) : a.nextButtonTitle = "Deploy";
}, a.nextCallback = function(e) {
return "image" === e.stepId ? (a.deployImage(), !1) : "results" !== e.stepId || (a.close(), !1);
};
} ],
controllerAs: "$ctrl",
bindings: {
project: "<",
context: "<",
onDialogClosed: "&"
},
templateUrl: "views/directives/deploy-image-dialog.html"
});
}(), function() {
angular.module("openshiftConsole").component("fromFileDialog", {
controller: [ "$scope", "$timeout", "$routeParams", "$filter", "DataService", function(e, t, n, a, r) {
function o() {
return u(_.get(s, "template.metadata.annotations.iconClass", "fa fa-clone"));
}
function i() {
var e = _.get(s, "template.metadata.annotations.iconClass", "fa fa-clone");
return l(e);
}
var s = this, c = a("annotation"), l = a("imageForIconClass"), u = a("normalizeIconClass");
s.$onInit = function() {
s.alerts = {}, s.loginBaseUrl = r.openshiftAPIBaseUrl(), n.project || (s.showProjectName = !0), e.$on("no-projects-cannot-create", function() {
s.importForm.$setValidity("required", !1);
});
}, s.importFile = function() {
e.$broadcast("importFileFromYAMLOrJSON");
}, s.instantiateTemplate = function() {
e.$broadcast("instantiateTemplate");
}, e.$on("fileImportedFromYAMLOrJSON", function(e, n) {
s.selectedProject = n.project, s.template = n.template, s.iconClass = o(), s.image = i(), s.vendor = c(n.template, "openshift.io/provider-display-name"), s.docUrl = c(s.template, "openshift.io/documentation-url"), s.supportUrl = c(s.template, "openshift.io/support-url"), s.actionLabel = "imported", n.isList ? (s.kind = null, s.name = "YAML / JSON") : n.resource && (s.kind = n.resource.kind, s.name = n.resource.metadata.name), t(function() {
s.currentStep = s.template ? "Template Configuration" : "Results";
}, 0);
}), e.$on("templateInstantiated", function(e, t) {
s.selectedProject = t.project, s.name = a("displayName")(s.template), s.actionLabel = null, s.kind = null, s.currentStep = "Results";
}), s.close = function() {
s.template = null;
var e = s.onDialogClosed();
return _.isFunction(e) && e(), s.wizardDone = !1, !0;
}, s.stepChanged = function(e) {
s.currentStep = e.title, "results" === e.stepId ? (s.nextButtonTitle = "Close", s.wizardDone = !0) : s.nextButtonTitle = "Create";
}, s.currentStep = "YAML / JSON", s.nextCallback = function(e) {
return "file" === e.stepId ? (s.importFile(), !1) : "template" === e.stepId ? (s.instantiateTemplate(), !1) : "results" !== e.stepId || (s.close(), !1);
};
} ],
controllerAs: "$ctrl",
bindings: {
project: "<",
context: "<",
onDialogClosed: "&"
},
templateUrl: "views/directives/from-file-dialog.html"
});
}(), function() {
angular.module("openshiftConsole").component("nextSteps", {
controller: [ "ProcessedTemplateService", "Navigate", function(e, t) {
function n(e) {
var t = [];
return angular.forEach(e, function(e) {
"completed" !== e.status && t.push(e);
}), t;
}
function a(e) {
var t = [];
return angular.forEach(e, function(e) {
e.hasErrors && t.push(e);
}), t;
}
var r = this;
r.showParamsTable = !1, r.actionLabel = r.actionLabel || "created";
var o = e.getTemplateData();
r.parameters = o.params, r.templateMessage = o.message, e.clearTemplateData();
var i = function(e) {
var t = _.get(r, "createdBuildConfig.spec.triggers", []);
return _.some(t, {
type: e
});
};
r.createdBuildConfigWithGitHubTrigger = function() {
return i("GitHub");
}, r.createdBuildConfigWithConfigChangeTrigger = function() {
return i("ConfigChange");
}, r.allTasksSuccessful = function(e) {
return !n(e).length && !a(e).length;
}, r.erroredTasks = a, r.pendingTasks = n, r.goToOverview = function() {
_.isFunction(r.onContinue) && r.onContinue(), t.toProjectOverview(r.projectName);
}, r.toggleParamsTable = function() {
r.showParamsTable = !r.showParamsTable;
};
} ],
bindings: {
project: "<",
projectName: "<",
loginBaseUrl: "<",
fromSampleRepo: "<",
createdBuildConfig: "<",
onContinue: "<",
showProjectName: "<",
kind: "<?",
name: "<",
actionLabel: "<?"
},
templateUrl: "views/directives/next-steps.html"
});
}(), angular.module("openshiftConsole").directive("imageNames", [ "$filter", "PodsService", function(e, t) {
return {
restrict: "E",
scope: {
podTemplate: "=",
pods: "="
},
templateUrl: "views/_image-names.html",
link: function(n) {
var a = e("imageSHA");
n.$watchGroup([ "podTemplate", "pods" ], function() {
var e = _.get(n, "podTemplate.spec.containers[0]");
if (e) {
var r = a(e.image);
n.imageIDs = r ? [ r ] : t.getImageIDs(n.pods, e.name);
}
});
}
};
} ]), function() {
angular.module("openshiftConsole").component("serviceBinding", {
controller: [ "APIService", "AuthorizationService", "DataService", "Logger", "SecretsService", "ServiceInstancesService", function(e, t, n, a, r, o) {
var i = this;
i.serviceBindingsVersion = e.getPreferredVersion("servicebindings"), i.secretsVersion = e.getPreferredVersion("secrets"), i.showParameterValues = !1;
var s = {
namespace: i.namespace
}, c = function() {
i.allowParametersReveal = t.canI("secrets", "get", i.namespace), i.parameterData = {}, i.opaqueParameterKeys = [];
var e = i.allowParametersReveal ? "" : "*****";
_.each(_.keys(_.get(i.bindParameterSchema, "properties")), function(t) {
i.parameterData[t] = e;
});
var o = _.get(i.binding, "status.externalProperties.parameters", {});
_.each(_.keys(o), function(e) {
"<redacted>" === o[e] ? i.parameterData[e] = "*****" : (i.parameterData[e] = o[e], i.opaqueParameterKeys.push(e));
}), i.allowParametersReveal && _.each(_.get(i.binding, "spec.parametersFrom"), function(e) {
n.get(i.secretsVersion, _.get(e, "secretKeyRef.name"), s).then(function(t) {
try {
var n = JSON.parse(r.decodeSecretData(t.data)[e.secretKeyRef.key]);
_.extend(i.parameterData, n);
} catch (t) {
a.warn("Unable to load parameters from secret " + _.get(e, "secretKeyRef.name"), t);
}
});
});
}, l = function() {
var t = e.getPreferredVersion("clusterserviceplans");
n.get(t, _.get(i.serviceInstance, "spec.clusterServicePlanRef.name"), s).then(function(e) {
i.bindParameterFormDefinition = angular.copy(_.get(e, "spec.externalMetadata.schemas.service_binding.create.openshift_form_definition")), i.bindParameterSchema = _.get(e, "spec.serviceBindingCreateParameterSchema"), c();
});
}, u = function() {
if ("ServiceInstance" !== _.get(i.refApiObject, "kind")) {
var e = _.get(i.binding, "spec.instanceRef.name");
i.serviceInstance = _.get(i.serviceInstances, [ e ]);
} else i.serviceInstance = i.refApiObject;
var t = o.getServiceClassNameForInstance(i.serviceInstance);
i.serviceClass = _.get(i.serviceClasses, [ t ]);
};
this.$onChanges = function(e) {
(e.binding || e.serviceInstances || e.serviceClasses) && (u(), l());
}, i.toggleShowParameterValues = function() {
i.showParameterValues = !i.showParameterValues;
};
} ],
controllerAs: "$ctrl",
bindings: {
namespace: "<",
binding: "<",
refApiObject: "<?",
serviceClasses: "<",
serviceInstances: "<",
isOverview: "<?"
},
templateUrl: "views/directives/_service-binding.html"
});
}(), angular.module("openshiftConsole").directive("dropdownItem", [ "$compile", function(e) {
return {
restrict: "E",
transclude: !0,
scope: {
action: "&",
enabled: "@"
},
link: function(t, n, a, r, o) {
function i() {
var n = "true" === t.enabled ? '<li><a ng-click="action()" href="" ng-transclude></a></li>' : '<li class="disabled"><a ng-click="$event.stopPropagation()" ng-transclude></a></li>', a = e(n, o)(t);
s.replaceWith(a), s = a;
}
var s = n;
t.$watch("action", i), t.$watch("enabled", i);
}
};
} ]), angular.module("openshiftConsole").directive("optionalLink", function() {
return {
restrict: "E",
scope: {
link: "@"
},
transclude: !0,
template: '<a ng-href="{{link}}" ng-transclude ng-if="link"></a><span ng-transclude ng-if="!link"></span>'
};
}), function() {
angular.module("openshiftConsole").component("mobileClientRow", {
controller: [ "$scope", "$filter", "$routeParams", "APIService", "AuthorizationService", "DataService", "ListRowUtils", "Navigate", "ProjectsService", function(e, t, n, a, r, o, i, s, c) {
var l = this;
l.installType = "", _.extend(l, i.ui), l.$onChanges = function(e) {
if (e.apiObject) switch (l.bundleDisplay = l.apiObject.spec.appIdentifier, l.clientType = l.apiObject.spec.clientType.toUpperCase(), l.apiObject.spec.clientType) {
case "android":
l.installType = "gradle";
break;

case "iOS":
l.installType = "cocoapods";
break;

case "cordova":
l.installType = "npm";
}
}, l.mobileclientVersion = {
group: "mobile.k8s.io",
version: "v1alpha1",
resource: "mobileclients"
}, l.actionsDropdownVisible = function() {
return !_.get(l.apiObject, "metadata.deletionTimestamp") && r.canI(l.mobileclientVersion, "delete");
}, l.projectName = n.project, l.browseCatalog = function() {
s.toProjectCatalog(l.projectName);
};
} ],
controllerAs: "row",
bindings: {
apiObject: "<",
state: "<"
},
templateUrl: "views/overview/_mobile-client-row.html"
});
}(), function() {
angular.module("openshiftConsole").component("virtualMachineRow", {
controller: [ "$scope", "$filter", "$routeParams", "APIService", "AuthorizationService", "DataService", "ListRowUtils", "Navigate", "ProjectsService", "KubevirtVersions", "moment", function(e, t, n, a, r, o, i, s, c, l, u) {
function d() {
return g.apiObject.spec.running;
}
function m() {
var e = angular.copy(g.apiObject);
return delete e._pod, delete e._vm, e;
}
function p(t) {
var n = m();
return n.spec.running = t, o.update(l.offlineVirtualMachine.resource, n.metadata.name, n, e.$parent.context);
}
var g = this;
g.OfflineVirtualMachineVersion = l.offlineVirtualMachine, _.extend(g, i.ui), g.actionsDropdownVisible = function() {
return !_.get(g.apiObject, "metadata.deletionTimestamp") && r.canI(l.offlineVirtualMachine, "delete");
}, g.projectName = n.project, g.startOvm = function() {
p(!0);
}, g.stopOvm = function() {
p(!1);
}, g.restartOvm = function() {
return o.delete(l.virtualMachine, g.apiObject._vm.metadata.name, e.$parent.context);
}, g.canStartOvm = function() {
return !d();
}, g.canStopOvm = function() {
return d();
}, g.canRestartOvm = function() {
return d() && g.apiObject._vm && "Running" === _.get(g.apiObject, "_pod.status.phase");
};
} ],
controllerAs: "row",
bindings: {
apiObject: "<",
state: "<"
},
templateUrl: "views/overview/_virtual-machine-row.html"
}), angular.module("openshiftConsole").filter("vmPodUptime", function() {
return function(e) {
var t = _(_.get(e, "status.containerStatuses")).filter({
name: "compute"
}).map("state.running.startedAt").first() || _.get(e, "status.startTime");
return t ? moment(t).fromNow(!0) : "--";
};
}), angular.module("openshiftConsole").directive("vmState", function() {
function e(e) {
var t = _.get(e, "_vm.status.phase");
return void 0 !== t ? t : _.get(e, ".spec.running") ? "Unknown" : "Not Running";
}
function t(t) {
return e(t.ovm);
}
function n(n) {
n.$watch(t, function() {
n.status = e(n.ovm);
});
}
return n.$inject = [ "$scope" ], {
scope: {
ovm: "<"
},
controller: n,
templateUrl: "views/overview/_vm-status.html"
};
}), angular.module("openshiftConsole").constant("KubevirtVersions", {
offlineVirtualMachine: {
resource: "offlinevirtualmachines",
group: "kubevirt.io",
version: "v1alpha1"
},
virtualMachine: {
resource: "virtualmachines",
group: "kubevirt.io",
version: "v1alpha1"
}
});
}(), function() {
angular.module("openshiftConsole").component("buildCounts", {
controller: [ "$scope", "BuildsService", function(e, t) {
var n = this;
n.interestingPhases = [ "Pending", "Running", "Failed", "Error" ];
var a = function(e) {
var t = _.get(e, "status.phase");
return _.includes(n.interestingPhases, t);
};
n.$onChanges = _.debounce(function() {
e.$apply(function() {
var e = _.groupBy(n.builds, "status.phase");
if (n.countByPhase = _.mapValues(e, _.size), n.show = _.some(n.builds, a), n.showRunningStage && 1 === n.countByPhase.Running) {
var r = _.head(e.Running);
n.currentStage = t.getCurrentStage(r);
} else n.currentStage = null;
});
}, 200);
} ],
controllerAs: "buildCounts",
bindings: {
builds: "<",
showRunningStage: "<",
label: "@"
},
templateUrl: "views/overview/_build-counts.html"
});
}(), function() {
angular.module("openshiftConsole").component("metricsSummary", {
controller: [ "$interval", "ConversionService", "MetricsCharts", "MetricsService", function(e, t, n, a) {
var r, o = this, i = !0, s = function(e) {
return e >= 1024;
};
o.metrics = [ {
label: "Memory",
convert: t.bytesToMiB,
formatUsage: function(e) {
return s(e) && (e /= 1024), n.formatUsage(e);
},
usageUnits: function(e) {
return s(e) ? "GiB" : "MiB";
},
datasets: [ "memory/usage" ],
type: "pod_container"
}, {
label: "CPU",
convert: t.millicoresToCores,
usageUnits: function() {
return "cores";
},
formatUsage: function(e) {
return e < .01 ? "< 0.01" : n.formatUsage(e);
},
datasets: [ "cpu/usage_rate" ],
type: "pod_container"
}, {
label: "Network",
units: "KiB/s",
convert: t.bytesToKiB,
formatUsage: function(e) {
return e < .01 ? "< 0.01" : n.formatUsage(e);
},
usageUnits: function() {
return "KiB/s";
},
datasets: [ "network/tx_rate", "network/rx_rate" ],
type: "pod"
} ];
var c = function() {
var e = _.find(o.pods, "metadata.namespace");
return e ? {
pods: o.pods,
namespace: e.metadata.namespace,
start: "-1mn",
bucketDuration: "1mn"
} : null;
}, l = function(e) {
return null === e.value || void 0 === e.value;
}, u = function(e, t) {
var n = null, a = {};
_.each(e.datasets, function(r) {
_.each(t[r], function(t, r) {
var o = _.last(t);
if (!l(o)) {
a[r] = !0;
var i = e.convert(o.value);
n = (n || 0) + i;
}
});
}), null === n ? delete e.currentUsage : e.currentUsage = n / _.size(a);
}, d = function(e) {
_.each(o.metrics, function(t) {
u(t, e);
});
}, m = function() {
o.error = !0;
}, p = function() {
if (!o.error && !i) {
var e = c();
e && (r = Date.now(), a.getPodMetrics(e).then(d, m));
}
};
o.updateInView = function(e) {
i = !e, e && (!r || Date.now() > r + n.getDefaultUpdateInterval()) && p();
};
var g;
o.$onInit = function() {
g = e(p, n.getDefaultUpdateInterval(), !1), p();
}, o.$onDestroy = function() {
g && (e.cancel(g), g = null);
};
} ],
controllerAs: "metricsSummary",
bindings: {
pods: "<",
containers: "<"
},
templateUrl: "views/overview/_metrics-summary.html"
});
}(), function() {
angular.module("openshiftConsole").component("miniLog", {
controllerAs: "miniLog",
controller: [ "$scope", "$filter", "APIService", "DataService", "HTMLService", function(e, t, n, a, r) {
var o, i, s, c = this, l = t("annotation"), u = c.numLines || 7, d = [];
c.lines = [];
var m = _.throttle(function() {
e.$evalAsync(function() {
c.lines = _.clone(d);
});
}, 200), p = 0, g = function(e) {
if (e) {
var t = ansi_up.escape_for_html(e), n = ansi_up.ansi_to_html(t), a = r.linkify(n, "_blank", !0);
p++, d.push({
markup: a,
id: p
}), d.length > u && (d = _.takeRight(d, u)), m();
}
}, f = function() {
s && (s.stop(), s = null);
}, h = function() {
var e = {
follow: !0,
tailLines: u
};
(s = a.createStream(i, o, c.context, e)).start(), s.onMessage(g), s.onClose(function() {
s = null;
});
};
c.$onInit = function() {
"ReplicationController" === c.apiObject.kind ? (i = "deploymentconfigs/log", o = l(c.apiObject, "deploymentConfig")) : (i = n.kindToResource(c.apiObject.kind) + "/log", o = c.apiObject.metadata.name), h();
}, c.$onDestroy = function() {
f();
};
} ],
bindings: {
apiObject: "<",
numLines: "<",
context: "<"
},
templateUrl: "views/overview/_mini-log.html"
});
}(), function() {
angular.module("openshiftConsole").component("notificationIcon", {
controller: [ "$scope", function(e) {
var t = this;
t.$onChanges = _.debounce(function() {
e.$apply(function() {
var e = _.groupBy(t.alerts, "type");
t.countByType = _.mapValues(e, _.size), t.byType = _.mapValues(e, function(e) {
return _.map(e, function(e) {
return _.escape(e.message);
}).join("<br>");
});
});
}, 200);
} ],
controllerAs: "notification",
bindings: {
alerts: "<"
},
templateUrl: "views/overview/_notification-icon.html"
});
}(), function() {
angular.module("openshiftConsole").component("overviewBuilds", {
controller: [ "$filter", function(e) {
var t, n = e("canI");
this.$onInit = function() {
t = n("builds/log", "get");
}, this.showLogs = function(e) {
if (this.hideLog) return !1;
if (!t) return !1;
if (!_.get(e, "status.startTimestamp")) return !1;
if ("Complete" !== _.get(e, "status.phase")) return !0;
var n = _.get(e, "status.completionTimestamp");
if (!n) return !1;
var a = moment().subtract(3, "m");
return moment(n).isAfter(a);
};
} ],
controllerAs: "overviewBuilds",
bindings: {
buildConfigs: "<",
recentBuildsByBuildConfig: "<",
context: "<",
hideLog: "<"
},
templateUrl: "views/overview/_builds.html"
});
}(), function() {
angular.module("openshiftConsole").component("overviewListRow", {
controller: [ "$filter", "$uibModal", "APIService", "BuildsService", "CatalogService", "DeploymentsService", "ListRowUtils", "Navigate", "NotificationsService", function(e, t, n, a, r, o, i, s, c) {
var l = this;
_.extend(l, i.ui);
var u = e("canI"), d = e("deploymentIsInProgress"), m = e("isBinaryBuild"), p = e("enableTechPreviewFeature");
l.deploymentConfigsInstantiateVersion = n.getPreferredVersion("deploymentconfigs/instantiate"), l.replicationControllersVersion = n.getPreferredVersion("replicationcontrollers"), l.serviceBindingsVersion = n.getPreferredVersion("servicebindings"), l.deploymentConfigsVersion = n.getPreferredVersion("deploymentconfigs"), l.deploymentConfigsInstantiateVersion = n.getPreferredVersion("deploymentconfigs/instantiate"), l.deploymentConfigsLogVersion = n.getPreferredVersion("deploymentconfigs/log"), l.podsVersion = n.getPreferredVersion("pods"), l.podsLogVersion = n.getPreferredVersion("pods/log");
var g = function(e) {
var t = _.get(e, "spec.triggers");
_.isEmpty(t) || (l.imageChangeTriggers = _.filter(t, function(e) {
return "ImageChange" === e.type && _.get(e, "imageChangeParams.automatic");
}));
}, f = function(e) {
e && !l.current && "DeploymentConfig" !== e.kind && "Deployment" !== e.kind && (l.current = e);
}, h = function(e) {
l.rgv = n.objectToResourceGroupVersion(e), f(e), g(e);
};
l.$onChanges = function(e) {
e.apiObject && h(e.apiObject.currentValue);
};
var v = [], y = function(e) {
if (!l.state.hpaByResource) return null;
var t = _.get(e, "kind"), n = _.get(e, "metadata.name");
return _.get(l.state.hpaByResource, [ t, n ], v);
};
l.showBindings = r.SERVICE_CATALOG_ENABLED && p("pod_presets"), l.$doCheck = function() {
l.notifications = i.getNotifications(l.apiObject, l.state), l.hpa = y(l.apiObject), l.current && _.isEmpty(l.hpa) && (l.hpa = y(l.current));
var e = _.get(l, "apiObject.metadata.uid");
e && (l.services = _.get(l, [ "state", "servicesByObjectUID", e ]), l.buildConfigs = _.get(l, [ "state", "buildConfigsByObjectUID", e ]), l.bindings = _.get(l, [ "state", "bindingsByApplicationUID", e ]));
var t;
"DeploymentConfig" === _.get(l, "apiObject.kind") && (t = _.get(l, "apiObject.metadata.name"), l.pipelines = _.get(l, [ "state", "pipelinesByDeploymentConfig", t ]), l.recentBuilds = _.get(l, [ "state", "recentBuildsByDeploymentConfig", t ]), l.recentPipelines = _.get(l, [ "state", "recentPipelinesByDeploymentConfig", t ]));
}, l.getPods = function(e) {
var t = _.get(e, "metadata.uid");
return _.get(l, [ "state", "podsByOwnerUID", t ]);
}, l.firstPod = function(e) {
var t = l.getPods(e);
return _.find(t);
}, l.isScalable = function() {
return !!_.isEmpty(l.hpa) && !l.isDeploymentInProgress();
}, l.isDeploymentInProgress = function() {
return !(!l.current || !l.previous) || d(l.current);
}, l.canIDoAny = function() {
var e = _.get(l, "apiObject.kind"), t = _.get(l, "apiObject.metadata.uid"), n = _.get(l.state.deleteableBindingsByApplicationUID, t);
switch (e) {
case "DeploymentConfig":
return !!u("deploymentconfigs/instantiate", "create") || !!u("deploymentconfigs", "update") || !(!l.current || !u("deploymentconfigs/log", "get")) || !(!p("pod_presets") || _.isEmpty(l.state.bindableServiceInstances) || !u(l.serviceBindingsVersion, "create")) || !(!p("pod_presets") || _.isEmpty(n) || !u(l.serviceBindingsVersion, "delete")) || l.showStartPipelineAction() || l.showStartBuildAction();

case "Pod":
return !!u("pods/log", "get") || !!u("pods", "update");

default:
return !((!l.firstPod(l.current) || !u("pods/log", "get")) && !u(l.rgv, "update") && (!p("pod_presets") || _.isEmpty(l.state.bindableServiceInstances) || !u(l.serviceBindingsVersion, "create")) && (!p("pod_presets") || _.isEmpty(n) || !u(l.serviceBindingsVersion, "delete")));
}
}, l.showStartBuildAction = function() {
if (!_.isEmpty(l.pipelines)) return !1;
if (!u("buildconfigs/instantiate", "create")) return !1;
if (1 !== _.size(l.buildConfigs)) return !1;
var e = _.head(l.buildConfigs);
return !m(e);
}, l.showStartPipelineAction = function() {
return u("buildconfigs/instantiate", "create") && 1 === _.size(l.pipelines);
}, l.startBuild = a.startBuild, l.canDeploy = function() {
return !(!l.apiObject || l.apiObject.metadata.deletionTimestamp || l.deploymentInProgress || l.apiObject.spec.paused);
}, l.isPaused = function() {
return l.apiObject.spec.paused;
}, l.startDeployment = function() {
o.startLatestDeployment(l.apiObject, {
namespace: l.apiObject.metadata.namespace
});
}, l.cancelDeployment = function() {
var e = l.current;
if (e) {
var n, a = e.metadata.name, r = _.get(l, "apiObject.status.latestVersion");
n = 1 === r ? "This will attempt to stop the in-progress deployment. It may take some time to complete." : "This will attempt to stop the in-progress deployment and rollback to the last successful deployment. It may take some time to complete.", t.open({
templateUrl: "views/modals/confirm.html",
controller: "ConfirmModalController",
resolve: {
modalConfig: function() {
return {
title: "Cancel deployment " + a + "?",
details: n,
okButtonText: "Yes, cancel",
okButtonClass: "btn-danger",
cancelButtonText: "No, don't cancel"
};
}
}
}).result.then(function() {
e.metadata.uid === l.current.metadata.uid ? (e = l.current, d(e) ? o.cancelRunningDeployment(e, {
namespace: e.metadata.namespace
}) : c.addNotification({
type: "error",
message: "Deployment " + a + " is no longer in progress."
})) : c.addNotification({
type: "error",
message: "Deployment #" + r + " is no longer the latest."
});
});
}
}, l.urlForImageChangeTrigger = function(t) {
var n = e("stripTag")(_.get(t, "imageChangeParams.from.name")), a = _.get(l, "apiObject.metadata.namespace"), r = _.get(t, "imageChangeParams.from.namespace", a);
return s.resourceURL(n, "ImageStream", r);
}, l.closeOverlayPanel = function() {
_.set(l, "overlay.panelVisible", !1);
}, l.showOverlayPanel = function(e, t) {
_.set(l, "overlay.panelVisible", !0), _.set(l, "overlay.panelName", e), _.set(l, "overlay.state", t);
};
} ],
controllerAs: "row",
bindings: {
apiObject: "<",
current: "<",
previous: "<",
state: "<",
hidePipelines: "<"
},
templateUrl: "views/overview/_list-row.html"
});
}(), function() {
angular.module("openshiftConsole").component("serviceInstanceRow", {
controller: [ "$filter", "APIService", "AuthorizationService", "BindingService", "ListRowUtils", "ServiceInstancesService", function(e, t, n, a, r, o) {
var i = this, s = e("isBindingFailed"), c = e("isBindingReady"), l = e("serviceInstanceFailedMessage"), u = e("truncate");
_.extend(i, r.ui);
var d = e("serviceInstanceDisplayName");
i.serviceBindingsVersion = t.getPreferredVersion("servicebindings"), i.serviceInstancesVersion = t.getPreferredVersion("serviceinstances");
var m = function() {
var e = o.getServiceClassNameForInstance(i.apiObject);
return _.get(i, [ "state", "serviceClasses", e ]);
}, p = function() {
var e = o.getServicePlanNameForInstance(i.apiObject);
return _.get(i, [ "state", "servicePlans", e ]);
}, g = function() {
_.get(i.apiObject, "metadata.deletionTimestamp") ? i.instanceStatus = "deleted" : s(i.apiObject) ? i.instanceStatus = "failed" : c(i.apiObject) ? i.instanceStatus = "ready" : i.instanceStatus = "pending";
};
i.$doCheck = function() {
g(), i.notifications = r.getNotifications(i.apiObject, i.state), i.serviceClass = m(), i.servicePlan = p(), i.displayName = d(i.apiObject, i.serviceClass), i.isBindable = a.isServiceBindable(i.apiObject, i.serviceClass, i.servicePlan);
}, i.$onChanges = function(e) {
e.bindings && (i.deleteableBindings = _.reject(i.bindings, "metadata.deletionTimestamp"));
}, i.getSecretForBinding = function(e) {
return e && _.get(i, [ "state", "secrets", e.spec.secretName ]);
}, i.actionsDropdownVisible = function() {
return !(_.get(i.apiObject, "metadata.deletionTimestamp") || (!i.isBindable || !n.canI(i.serviceBindingsVersion, "create")) && (_.isEmpty(i.deleteableBindings) || !n.canI(i.serviceBindingsVersion, "delete")) && !n.canI(i.serviceInstancesVersion, "delete"));
}, i.closeOverlayPanel = function() {
_.set(i, "overlay.panelVisible", !1);
}, i.showOverlayPanel = function(e, t) {
_.set(i, "overlay.panelVisible", !0), _.set(i, "overlay.panelName", e), _.set(i, "overlay.state", t);
}, i.getFailedTooltipText = function() {
var e = l(i.apiObject);
if (!e) return "";
var t = u(e, 128);
return e.length !== t.length && (t += "..."), t;
}, i.deprovision = function() {
o.deprovision(i.apiObject, i.deleteableBindings);
};
} ],
controllerAs: "row",
bindings: {
apiObject: "<",
state: "<",
bindings: "<"
},
templateUrl: "views/overview/_service-instance-row.html"
});
}(), angular.module("openshiftConsole").component("overviewNetworking", {
controllerAs: "networking",
bindings: {
rowServices: "<",
allServices: "<",
routesByService: "<"
},
templateUrl: "views/overview/_networking.html"
}), angular.module("openshiftConsole").component("overviewPipelines", {
controllerAs: "overviewPipelines",
bindings: {
recentPipelines: "<"
},
templateUrl: "views/overview/_pipelines.html"
}), angular.module("openshiftConsole").component("overviewServiceBindings", {
controllerAs: "$ctrl",
bindings: {
sectionTitle: "@",
namespace: "<",
refApiObject: "<",
bindings: "<",
bindableServiceInstances: "<",
serviceClasses: "<",
serviceInstances: "<",
createBinding: "&"
},
templateUrl: "views/overview/_service-bindings.html"
}), angular.module("openshiftConsole").directive("deployImage", [ "$filter", "$q", "$window", "$uibModal", "APIService", "ApplicationGenerator", "DataService", "ImagesService", "Navigate", "NotificationsService", "ProjectsService", "QuotaService", "TaskList", "SecretsService", "keyValueEditorUtils", function(e, t, n, a, r, o, i, s, c, l, u, d, m, p, g) {
var f = r.getPreferredVersion("imagestreamimages"), h = r.getPreferredVersion("configmaps"), v = r.getPreferredVersion("secrets");
return {
restrict: "E",
scope: {
project: "=",
isDialog: "="
},
templateUrl: "views/directives/deploy-image.html",
controller: [ "$scope", function(e) {
e.forms = {}, e.noProjectsCantCreate = !1, e.input = {
selectedProject: e.project
}, e.$watch("input.selectedProject.metadata.name", function() {
e.projectNameTaken = !1;
});
} ],
link: function(n) {
function r() {
var e = g.mapEntries(g.compactEntries(n.labels));
return s.getResources({
name: n.app.name,
image: n.import.name,
namespace: n.import.namespace,
tag: n.import.tag || "latest",
ports: n.ports,
volumes: n.volumes,
env: g.compactEntries(n.env),
labels: e
});
}
n.mode = "istag", n.istag = {}, n.app = {}, n.env = [], n.labels = [ {
name: "app",
value: ""
} ], n.$on("no-projects-cannot-create", function() {
n.noProjectsCantCreate = !0;
});
var p = e("orderByDisplayName"), y = e("getErrorDetails"), b = {}, S = function() {
l.hideNotification("deploy-image-list-config-maps-error"), l.hideNotification("deploy-image-list-secrets-error"), _.each(b, function(e) {
!e.id || "error" !== e.type && "warning" !== e.type || l.hideNotification(e.id);
});
};
n.valueFromNamespace = {};
var C = function() {
if (_.has(n.input.selectedProject, "metadata.uid")) return t.when(n.input.selectedProject);
var a = n.input.selectedProject.metadata.name, r = n.input.selectedProject.metadata.annotations["new-display-name"], o = e("description")(n.input.selectedProject);
return u.create(a, r, o);
}, w = e("stripTag"), P = e("stripSHA"), k = e("humanizeKind"), j = function(e) {
return e.length > 24 ? e.substring(0, 24) : e;
}, R = function() {
var e = _.last(n.import.name.split("/"));
return e = P(e), e = w(e), e = j(e);
};
n.findImage = function() {
n.loading = !0, s.findImage(n.imageName, {
namespace: n.input.selectedProject.metadata.name
}).then(function(e) {
if (n.import = e, n.loading = !1, "Success" === _.get(e, "result.status")) {
n.forms.imageSelection.imageName.$setValidity("imageLoaded", !0);
var t = n.import.image;
t && (n.app.name = R(), n.runsAsRoot = s.runsAsRoot(t), n.ports = o.parsePorts(t), n.volumes = s.getVolumes(t), n.createImageStream = !0);
} else n.import.error = _.get(e, "result.message", "An error occurred finding the image.");
}, function(t) {
n.import = {
error: e("getErrorDetails")(t) || "An error occurred finding the image."
}, n.loading = !1;
});
}, n.$watch("app.name", function(e, t) {
n.nameTaken = !1;
var a = _.find(n.labels, {
name: "app"
});
!a || a.value && a.value !== t || (a.value = e);
}), n.$watch("mode", function(e, t) {
e !== t && (delete n.import, n.istag = {}, "dockerImage" === e ? n.forms.imageSelection.imageName.$setValidity("imageLoaded", !1) : n.forms.imageSelection.imageName.$setValidity("imageLoaded", !0));
}), n.$watch("imageName", function() {
"dockerImage" === n.mode && n.forms.imageSelection.imageName.$setValidity("imageLoaded", !1);
}), n.$watch("istag", function(t, a) {
if (t !== a) if (t.namespace && t.imageStream && t.tagObject) {
var r, c = _.get(t, "tagObject.items[0].image");
n.app.name = j(t.imageStream), n.import = {
name: t.imageStream,
tag: t.tagObject.tag,
namespace: t.namespace
}, c && (r = t.imageStream + "@" + c, n.loading = !0, i.get(f, r, {
namespace: t.namespace
}).then(function(e) {
n.loading = !1, n.import.image = e.image, n.ports = o.parsePorts(e.image), n.volumes = s.getVolumes(e.image), n.runsAsRoot = !1;
}, function(t) {
n.import.error = e("getErrorDetails")(t) || "An error occurred.", n.loading = !1;
}));
} else delete n.import;
}, !0), n.$watch("input.selectedProject", function(e) {
if (n.env = _.reject(n.env, "valueFrom"), _.get(e, "metadata.uid")) {
if (!n.valueFromNamespace[e.metadata.name]) {
var t = [], a = [];
i.list(h, {
namespace: n.input.selectedProject.metadata.name
}, null, {
errorNotification: !1
}).then(function(r) {
t = p(r.by("metadata.name")), n.valueFromNamespace[e.metadata.name] = t.concat(a);
}, function(e) {
403 !== e.status && l.addNotification({
id: "deploy-image-list-config-maps-error",
type: "error",
message: "Could not load config maps.",
details: y(e)
});
}), i.list(v, {
namespace: n.input.selectedProject.metadata.name
}, null, {
errorNotification: !1
}).then(function(r) {
a = p(r.by("metadata.name")), n.valueFromNamespace[e.metadata.name] = a.concat(t);
}, function(e) {
403 !== e.status && l.addNotification({
id: "deploy-image-list-secrets-error",
type: "error",
message: "Could not load secrets.",
details: y(e)
});
});
}
} else n.mode = "istag";
});
var I, T = e("displayName"), N = function() {
var e = {
started: "Deploying image " + n.app.name + " to project " + T(n.input.selectedProject),
success: "Deployed image " + n.app.name + " to project " + T(n.input.selectedProject),
failure: "Failed to deploy image " + n.app.name + " to project " + T(n.input.selectedProject)
};
m.clear(), m.add(e, {}, n.input.selectedProject.metadata.name, function() {
var e = t.defer();
return i.batch(I, {
namespace: n.input.selectedProject.metadata.name
}).then(function(t) {
var a, r = !_.isEmpty(t.failure);
a = r ? (a = _.map(t.failure, function(e) {
return {
type: "error",
message: "Cannot create " + k(e.object.kind).toLowerCase() + ' "' + e.object.metadata.name + '". ',
details: e.data.message
};
})).concat(_.map(t.success, function(e) {
return {
type: "success",
message: "Created " + k(e.kind).toLowerCase() + ' "' + e.metadata.name + '" successfully. '
};
})) : [ {
type: "success",
message: "All resources for image " + n.app.name + " were created successfully."
} ], e.resolve({
alerts: a,
hasErrors: r
});
}), e.promise;
}), n.isDialog ? n.$emit("deployImageNewAppCreated", {
project: n.input.selectedProject,
appName: n.app.name
}) : c.toNextSteps(n.app.name, n.input.selectedProject.metadata.name);
}, A = function(e) {
a.open({
templateUrl: "views/modals/confirm.html",
controller: "ConfirmModalController",
resolve: {
modalConfig: function() {
return {
alerts: e,
title: "Confirm Creation",
details: "Problems were detected while checking your application configuration.",
okButtonText: "Create Anyway",
okButtonClass: "btn-danger",
cancelButtonText: "Cancel"
};
}
}
}).result.then(N);
}, E = function(e) {
b = e.quotaAlerts || [];
var t = _.filter(b, {
type: "error"
});
n.nameTaken || t.length ? (n.disableInputs = !1, _.each(b, function(e) {
e.id = _.uniqueId("deploy-image-alert-"), l.addNotification(e);
})) : b.length ? (A(b), n.disableInputs = !1) : N();
};
n.create = function() {
n.disableInputs = !0, S(), C().then(function(e) {
n.input.selectedProject = e, I = r();
var t = o.ifResourcesDontExist(I, n.input.selectedProject.metadata.name), a = d.getLatestQuotaAlerts(I, {
namespace: n.input.selectedProject.metadata.name
}), i = function(e) {
return n.nameTaken = e.nameTaken, a;
};
t.then(i, i).then(E, E);
}, function(e) {
n.disableInputs = !1, "AlreadyExists" === e.data.reason ? n.projectNameTaken = !0 : l.addNotification({
id: "deploy-image-create-project-error",
type: "error",
message: "An error occurred creating project.",
details: y(e)
});
});
}, n.openCreateWebhookSecretModal = function() {
var e = n.$new();
e.type = "image", e.namespace = n.input.selectedProject.metadata.name, a.open({
templateUrl: "views/modals/create-secret.html",
controller: "CreateSecretModalController",
scope: e
});
}, n.$on("newAppFromDeployImage", n.create), n.$on("$destroy", S);
}
};
} ]), angular.module("openshiftConsole").directive("selector", function() {
return {
restrict: "E",
scope: {
selector: "="
},
templateUrl: "views/directives/selector.html"
};
}), angular.module("openshiftConsole").directive("selectContainers", function() {
return {
restrict: "E",
scope: {
containers: "=ngModel",
template: "=podTemplate",
required: "=ngRequired",
helpText: "@?"
},
templateUrl: "views/directives/select-containers.html",
controller: [ "$scope", function(e) {
e.containers = e.containers || {}, e.$watch("containers", function(t) {
e.containerSelected = _.some(t, function(e) {
return e;
});
}, !0);
} ]
};
}), angular.module("openshiftConsole").directive("buildHooks", function() {
return {
restrict: "E",
templateUrl: "views/directives/build-hooks.html",
scope: {
build: "="
}
};
}), angular.module("openshiftConsole").directive("pauseRolloutsCheckbox", [ "APIService", function(e) {
return {
restrict: "E",
scope: {
deployment: "=",
disabled: "=ngDisabled",
alwaysVisible: "="
},
templateUrl: "views/directives/pause-rollouts-checkbox.html",
link: function(t) {
var n = function() {
if (!t.deployment) return !1;
var n = e.objectToResourceGroupVersion(t.deployment);
return "deploymentconfigs" === n.resource && !n.group;
};
t.$watch("deployment.spec.triggers", function(e) {
t.missingConfigChangeTrigger = n() && !_.some(e, {
type: "ConfigChange"
});
}, !0);
}
};
} ]), angular.module("openshiftConsole").directive("keyValueEditor", [ "$routeParams", "$timeout", "$filter", "APIService", "keyValueEditorConfig", "keyValueEditorUtils", function(e, t, n, a, r, o) {
var i = n("humanizeKind"), s = n("canI"), c = 1e3;
return {
restrict: "AE",
scope: {
keyMinlength: "@",
keyMaxlength: "@",
valueMinlength: "@",
valueMaxlength: "@",
entries: "=",
keyPlaceholder: "@",
valuePlaceholder: "@",
keyValidator: "@",
keyValidatorRegex: "=",
valueValidator: "@",
valueValidatorRegex: "=",
keyValidatorError: "@",
keyValidatorErrorTooltip: "@",
keyValidatorErrorTooltipIcon: "@",
valueValidatorError: "@",
valueValidatorErrorTooltip: "@",
valueValidatorErrorTooltipIcon: "@",
valueIconTooltip: "@",
valueFromSelectorOptions: "=",
cannotAdd: "=?",
cannotSort: "=?",
cannotDelete: "=?",
isReadonly: "=?",
isReadonlyValue: "=?",
isReadonlyKeys: "=?",
addRowLink: "@",
addRowWithSelectorsLink: "@",
showHeader: "=?",
allowEmptyKeys: "=?",
keyRequiredError: "@"
},
templateUrl: "views/directives/key-value-editor.html",
link: function(e, n, a) {
var o;
e.validation = {
key: e.keyValidator,
val: e.valueValidator
}, a.keyValidatorRegex && (e.validation.key = e.keyValidatorRegex), a.valueValidatorRegex && (e.validation.val = e.valueValidatorRegex), "grabFocus" in a && (e.grabFocus = !0, t(function() {
e.grabFocus = void 0;
})), "cannotAdd" in a && (e.cannotAdd = !0), "cannotDelete" in a && (e.cannotDeleteAny = !0), "isReadonly" in a && (e.isReadonlyAny = !0), "isReadonlyKeys" in a && (o = e.$watch("entries", function(t) {
t && (_.each(e.entries, function(e) {
e.isReadonlyKey = !0;
}), o());
})), "cannotSort" in a && (e.cannotSort = !0), "showHeader" in a && (e.showHeader = !0), "allowEmptyKeys" in a && (e.allowEmptyKeys = !0), e.groupByKind = function(e) {
return i(e.kind);
}, e.valueFromObjectSelected = function(e, t) {
"ConfigMap" === t.kind ? (e.valueFrom.configMapKeyRef = {
name: t.metadata.name
}, delete e.valueFrom.secretKeyRef) : "Secret" === t.kind && (e.valueFrom.secretKeyRef = {
name: t.metadata.name
}, delete e.valueFrom.configMapKeyRef), delete e.selectedValueFromKey;
}, e.valueFromKeySelected = function(e, t) {
e.valueFrom.configMapKeyRef ? e.valueFrom.configMapKeyRef.key = t : e.valueFrom.secretKeyRef && (e.valueFrom.secretKeyRef.key = t);
}, angular.extend(e, {
keyMinlength: r.keyMinlength || a.keyMinlength,
keyMaxlength: r.keyMaxlength || a.keyMaxlength,
valueMinlength: r.valueMinlength || a.valueMinlength,
valueMaxlength: r.valueMaxlength || a.valueMaxlength,
keyValidator: r.keyValidator || a.keyValidator,
valueValidator: r.valueValidator || a.valueValidator,
keyValidatorError: r.keyValidatorError || a.keyValidatorError,
valueValidatorError: r.valueValidatorError || a.valueValidatorError,
keyRequiredError: r.keyRequiredError || a.keyRequiredError,
keyValidatorErrorTooltip: r.keyValidatorErrorTooltip || a.keyValidatorErrorTooltip,
keyValidatorErrorTooltipIcon: r.keyValidatorErrorTooltipIcon || a.keyValidatorErrorTooltipIcon,
valueValidatorErrorTooltip: r.valueValidatorErrorTooltip || a.valueValidatorErrorTooltip,
valueValidatorErrorTooltipIcon: r.valueValidatorErrorTooltipIcon || a.valueValidatorErrorTooltipIcon,
keyPlaceholder: r.keyPlaceholder || a.keyPlaceholder,
valuePlaceholder: r.valuePlaceholder || a.valuePlaceholder
});
},
controller: [ "$scope", function(t) {
var n = [], r = [], i = c++;
t.configMapVersion = a.getPreferredVersion("configmaps"), t.secretsVersion = a.getPreferredVersion("secrets");
var l = s(t.secretsVersion, "get"), u = s(t.configMapVersion, "get");
angular.extend(t, {
namespace: e.project,
unique: i,
forms: {},
placeholder: o.newEntry(),
setFocusKeyClass: "key-value-editor-set-focus-key-" + i,
setFocusValClass: "key-value-editor-set-focus-value-" + i,
uniqueForKey: o.uniqueForKey,
uniqueForValue: o.uniqueForValue,
dragControlListeners: {
accept: function(e, t) {
return e.itemScope.sortableScope.$id === t.$id;
},
orderChanged: function() {
t.forms.keyValueEditor.$setDirty();
}
},
deleteEntry: function(e, n) {
t.entries.splice(e, n), !t.entries.length && t.addRowLink && o.addEntry(t.entries), t.forms.keyValueEditor.$setDirty();
},
isReadonlySome: function(e) {
return _.includes(n, e);
},
cannotDeleteSome: function(e) {
return _.includes(r, e);
},
onAddRow: function() {
o.addEntry(t.entries), o.setFocusOn("." + t.setFocusKeyClass);
},
onAddRowWithSelectors: function() {
o.addEntryWithSelectors(t.entries), o.setFocusOn("." + t.setFocusKeyClass);
},
isValueFromReadonly: function(e) {
return t.isReadonlyAny || e.isReadonlyValue || e.refType && !e.selectedValueFrom || _.isEmpty(t.valueFromSelectorOptions);
}
}), t.$watch("cannotDelete", function(e) {
angular.isArray(e) && (t.cannotDeleteAny = !1, r = e);
}), t.$watch("isReadonly", function(e) {
angular.isArray(e) && (t.isReadonlyAny = !1, n = e);
}), t.$watch("addRowLink", function(e) {
t.addRowLink = e || "Add row", t.entries && !t.entries.length && o.addEntry(t.entries);
}), t.$watch("entries", function(e) {
e && !e.length && o.addEntry(t.entries), _.each(t.entries, function(e) {
o.altTextForValueFrom(e, t.namespace), o.setEntryPerms(e, l, u);
}), o.findReferenceValueForEntries(e, t.valueFromSelectorOptions);
}), t.$watch("valueFromSelectorOptions", function() {
o.findReferenceValueForEntries(t.entries, t.valueFromSelectorOptions);
});
} ]
};
} ]), angular.module("openshiftConsole").directive("confirmOnExit", [ "Logger", function(e) {
return {
scope: {
dirty: "=",
message: "="
},
link: function(t) {
if (!_.get(window, "OPENSHIFT_CONSTANTS.DISABLE_CONFIRM_ON_EXIT") && !_.get(window, "OPENSHIFT_CONSTANTS.CONFIRM_DIALOG_BLOCKED")) {
var n = function() {
return t.message || "You have unsaved changes. Leave this page anyway?";
}, a = function() {
if (t.dirty) return n();
};
$(window).on("beforeunload", a);
var r = t.$on("$routeChangeStart", function(a) {
if (t.dirty) {
var r = new Date().getTime();
confirm(n()) || (new Date().getTime() - r < 50 ? (_.set(window, "OPENSHIFT_CONSTANTS.CONFIRM_DIALOG_BLOCKED", !0), e.warn("Confirm on exit prompt appears to have been blocked by the browser.")) : a.preventDefault());
}
});
t.$on("$destroy", function() {
$(window).off("beforeunload", a), r && r();
});
}
}
};
} ]), function() {
angular.module("openshiftConsole").component("uiAceYaml", {
controller: [ "$scope", function(e) {
var t, n = this, a = function(e) {
return jsyaml.safeLoad(n.model, {
json: !e
});
}, r = function() {
t.getSession().clearAnnotations(), e.$evalAsync(function() {
n.annotations = {};
});
}, o = function(a, r) {
var o = t.getSession(), i = o.getLength(), s = _.get(a, "mark.line", 0), c = _.get(a, "mark.column", 0), l = a.message || "Could not parse content.";
s >= i && (s = i - 1);
var u = {
row: s,
column: c,
text: l,
type: r
};
o.setAnnotations([ u ]), e.$evalAsync(function() {
n.annotations = {}, n.annotations[r] = [ u ];
});
}, i = function(t) {
e.$evalAsync(function() {
n.form.$setValidity("yamlValid", t);
});
};
n.onFileAdded = function(e) {
n.model = e;
}, n.$onInit = function() {
n.resource && (n.model = jsyaml.safeDump(n.resource, {
sortKeys: !0
}));
}, n.aceLoaded = function(e) {
t = e;
var n = e.getSession();
n.setOption("tabSize", 2), n.setOption("useSoftTabs", !0), e.setDragDelay = 0;
}, e.$watch(function() {
return n.model;
}, function(e, t) {
var s;
try {
s = a(!1), i(!0), e !== t && (n.resource = s);
try {
a(!0), r();
} catch (e) {
o(e, "warning");
}
} catch (e) {
o(e, "error"), i(!1);
}
}), n.gotoLine = function(e) {
t.gotoLine(e);
};
} ],
controllerAs: "$ctrl",
bindings: {
resource: "=",
ngRequired: "<?",
showFileInput: "<?"
},
templateUrl: "views/directives/ui-ace-yaml.html"
});
}(), angular.module("openshiftConsole").directive("affix", [ "$window", function(e) {
return {
restrict: "AE",
scope: {
offsetTop: "@",
offsetBottom: "@"
},
link: function(e, t, n, a) {
t.affix({
offset: {
top: n.offsetTop,
bottom: n.offsetBottom
}
});
}
};
} ]), function() {
angular.module("openshiftConsole").component("editEnvironmentVariables", {
controller: [ "$filter", "APIService", "DataService", "EnvironmentService", "NotificationsService", function(e, t, n, a, r) {
var o, i, s, c, l = this, u = t.getPreferredVersion("configmaps"), d = t.getPreferredVersion("secrets"), m = !1, p = [], g = [], f = !1, h = e("canI"), v = e("getErrorDetails"), y = e("humanizeKind"), b = e("orderByDisplayName"), S = function(e, t) {
m || (l.form && !l.form.$pristine && l.updatedObject ? a.isEnvironmentEqual(e, t) ? l.updatedObject = a.mergeEdits(l.updatedObject, e) : (m = !0, r.addNotification({
type: "warning",
message: "The environment variables for the " + o + " have been updated in the background.",
details: "Saving your changes may create a conflict or cause loss of data."
})) : l.updatedObject = a.copyAndNormalize(e));
}, C = function() {
n.list(u, {
namespace: l.apiObject.metadata.namespace
}).then(function(e) {
p = b(e.by("metadata.name")), l.valueFromObjects = p.concat(g);
});
}, w = function() {
h("secrets", "list") && n.list(d, {
namespace: l.apiObject.metadata.namespace
}).then(function(e) {
g = b(e.by("metadata.name")), l.valueFromObjects = p.concat(g);
});
}, _ = function() {
f || (f = !0, C(), w());
}, P = function(e, n) {
o = y(e.kind), i = e.metadata.name, s = t.objectToResourceGroupVersion(e), l.canIUpdate = h(s, "update"), c ? c.finally(function() {
S(e, n);
}) : S(e, n), l.containers = a.getContainers(l.updatedObject), l.disableValueFrom || l.ngReadonly || !l.canIUpdate || _();
};
l.$onChanges = function(e) {
e.apiObject && e.apiObject.currentValue && P(e.apiObject.currentValue, e.apiObject.previousValue);
}, l.save = function() {
var e = "save-env-error-" + i;
r.hideNotification(e), a.compact(l.updatedObject), (c = n.update(s, i, l.updatedObject, {
namespace: l.updatedObject.metadata.namespace
})).then(function() {
r.addNotification({
type: "success",
message: "Environment variables for " + o + " " + i + " were successfully updated."
}), l.form.$setPristine();
}, function(t) {
r.addNotification({
id: e,
type: "error",
message: "An error occurred updating environment variables for " + o + " " + i + ".",
details: v(t)
});
}).finally(function() {
c = null;
});
}, l.clearChanges = function() {
l.updatedObject = a.copyAndNormalize(l.apiObject), l.containers = a.getContainers(l.updatedObject), l.form.$setPristine(), m = !1;
};
} ],
controllerAs: "$ctrl",
bindings: {
apiObject: "<",
ngReadonly: "<",
disableValueFrom: "<"
},
templateUrl: "views/directives/edit-environment-variables.html"
});
}(), angular.module("openshiftConsole").component("initContainersSummary", {
bindings: {
apiObject: "<"
},
templateUrl: "views/_init-containers-summary.html",
controller: [ "$filter", function(e) {
var t = this;
t.$onChanges = function(n) {
var a = _.get(n.apiObject, "currentValue");
if (a) switch (t.podTemplate = e("podTemplate")(a), a.kind) {
case "DeploymentConfig":
case "Deployment":
t.tab = "configuration";
break;

default:
t.tab = "details";
}
};
} ]
}), function() {
angular.module("openshiftConsole").component("notificationCounter", {
templateUrl: "views/directives/notifications/notification-counter.html",
bindings: {},
controller: [ "$filter", "$routeParams", "$rootScope", "Constants", function(e, t, n, a) {
var r = this, o = _.get(a, "DISABLE_GLOBAL_EVENT_WATCH"), i = e("isIE")();
r.hide = !0;
var s = [], c = [], l = function(e, t) {
e && c.push(n.$on("NotificationDrawerWrapper.onUnreadNotifications", t));
}, u = function() {
_.each(c, function(e) {
e && e();
}), c = [];
}, d = function() {
_.each(s, function(e) {
e();
}), s = [];
}, m = function(e) {
r.hide = !e;
};
r.onClick = function() {
n.$emit("NotificationDrawerWrapper.toggle");
};
var p = function(e, t) {
r.showUnreadNotificationsIndicator = !!t;
}, g = function(e, t) {
return _.get(e, "params.project") !== _.get(t, "params.project");
}, f = function() {
l(t.project, p), m(t.project);
}, h = function() {
f(), s.push(n.$on("$routeChangeSuccess", function(e, t, n) {
g(t, n) && f();
})), s.push(n.$on("NotificationDrawerWrapper.onMarkAllRead", function() {
r.showUnreadNotificationsIndicator = !1;
}));
};
r.$onInit = function() {
o || i ? r.hide = !0 : h();
}, r.$onDestroy = function() {
u(), d();
};
} ]
});
}(), function() {
angular.module("openshiftConsole").component("notificationDrawerWrapper", {
templateUrl: "views/directives/notifications/notification-drawer-wrapper.html",
controller: [ "$filter", "$interval", "$location", "$rootScope", "$routeParams", "$scope", "$timeout", "APIService", "Constants", "DataService", "EventsService", "NotificationsService", function(e, t, n, a, r, o, i, s, c, l, u) {
var d, m, p = s.getPreferredVersion("events"), g = s.getPreferredVersion("projects"), f = _.get(c, "DISABLE_GLOBAL_EVENT_WATCH"), h = e("isIE")(), v = this, y = [], b = {}, S = {}, C = {}, w = function(e) {
e || (v.drawerHidden = !0);
}, P = function(e, t) {
return _.get(e, "params.project") !== _.get(t, "params.project");
}, k = function(e) {
return l.get(g, e, {}, {
errorNotification: !1
}).then(function(e) {
return C[e.metadata.name] = e, e;
});
}, j = function(t, n) {
return {
heading: e("displayName")(C[t]),
project: C[t],
notifications: n
};
}, R = function(e) {
return _.filter(e, "unread");
}, I = function() {
_.each(v.notificationGroups, function(e) {
e.totalUnread = R(e.notifications).length, e.hasUnread = !!e.totalUnread, a.$emit("NotificationDrawerWrapper.onUnreadNotifications", e.totalUnread);
});
}, T = function(e) {
_.each(v.notificationGroups, function(t) {
_.remove(t.notifications, {
uid: e.uid,
namespace: e.namespace
});
});
}, N = function(e) {
S[r.project] && delete S[r.project][e.uid], b[r.project] && delete b[r.project][e.uid], T(e);
}, A = function() {
b[r.project] = {}, S[r.project] = {};
}, E = function(e) {
return _.reduce(e, function(e, t) {
return e[t.metadata.uid] = {
actions: null,
uid: t.metadata.uid,
trackByID: t.metadata.uid,
unread: !u.isRead(t.metadata.uid),
type: t.type,
lastTimestamp: t.lastTimestamp,
firstTimestamp: t.firstTimestamp,
event: t
}, e;
}, {});
}, D = function(e) {
return _.reduce(e, function(e, t) {
return u.isImportantAPIEvent(t) && !u.isCleared(t.metadata.uid) && (e[t.metadata.uid] = t), e;
}, {});
}, $ = function(e, t) {
var n = r.project;
return _.assign({}, e[n], t[n]);
}, B = function(e) {
return _.orderBy(e, [ "event.lastTimestamp", "event.metadata.resourceVersion" ], [ "desc", "desc" ]);
}, L = function() {
a.$evalAsync(function() {
v.notificationGroups = [ j(r.project, B($(b, S))) ], I();
});
}, V = function() {
_.each(y, function(e) {
e();
}), y = [];
}, U = function() {
m && (l.unwatch(m), m = null);
}, O = function() {
d && d(), d = null;
}, F = function(e) {
b[r.project] = E(D(e.by("metadata.name"))), L();
}, x = function(e, t) {
var n = t.namespace || r.project, a = t.id ? n + "/" + t.id : _.uniqueId("notification_") + Date.now();
t.showInDrawer && !u.isCleared(a) && (S[n] = S[n] || {}, S[n][a] = {
actions: t.actions,
unread: !u.isRead(a),
trackByID: t.trackByID,
uid: a,
type: t.type,
lastTimestamp: t.timestamp,
message: t.message,
isHTML: t.isHTML,
details: t.details,
namespace: n,
links: t.links
}, L());
}, M = function(e, t) {
U(), e && (m = l.watch(p, {
namespace: e
}, _.debounce(t, 400), {
skipDigest: !0
}));
}, q = _.once(function(e, t) {
O(), d = a.$on("NotificationsService.onNotificationAdded", t);
}), z = function() {
k(r.project).then(function() {
M(r.project, F), q(r.project, x), w(r.project), L();
});
};
angular.extend(v, {
drawerHidden: !0,
allowExpand: !0,
drawerExpanded: "true" === localStorage.getItem("openshift/notification-drawer-expanded"),
drawerTitle: "Notifications",
hasUnread: !1,
showClearAll: !0,
showMarkAllRead: !0,
onClose: function() {
v.drawerHidden = !0;
},
onMarkAllRead: function(e) {
_.each(e.notifications, function(e) {
e.unread = !1, u.markRead(e.uid);
}), L(), a.$emit("NotificationDrawerWrapper.onMarkAllRead");
},
onClearAll: function(e) {
_.each(e.notifications, function(e) {
e.unread = !1, u.markRead(e.uid), u.markCleared(e.uid);
}), A(), L(), a.$emit("NotificationDrawerWrapper.onMarkAllRead");
},
notificationGroups: [],
headingInclude: "views/directives/notifications/header.html",
notificationBodyInclude: "views/directives/notifications/notification-body.html",
customScope: {
clear: function(e, t, n) {
u.markRead(e.uid), u.markCleared(e.uid), n.notifications.splice(t, 1), N(e), L();
},
markRead: function(e) {
e.unread = !1, u.markRead(e.uid), L();
},
close: function() {
v.drawerHidden = !0;
},
onLinkClick: function(e) {
e.onClick(), v.drawerHidden = !0;
},
countUnreadNotifications: I
}
}), o.$watch("$ctrl.drawerExpanded", function(e) {
localStorage.setItem("openshift/notification-drawer-expanded", e ? "true" : "false");
});
var H = function() {
r.project && z(), y.push(a.$on("$routeChangeSuccess", function(e, t, n) {
P(t, n) && (v.customScope.projectName = r.project, z());
})), y.push(a.$on("NotificationDrawerWrapper.toggle", function() {
v.drawerHidden = !v.drawerHidden;
})), y.push(a.$on("NotificationDrawerWrapper.hide", function() {
v.drawerHidden = !0;
})), y.push(a.$on("NotificationDrawerWrapper.clear", function(e, t) {
u.markCleared(t.uid), N(t), I();
}));
};
v.$onInit = function() {
f || h || H();
}, v.$onDestroy = function() {
O(), U(), V();
};
} ]
});
}(), angular.module("openshiftConsole").filter("duration", function() {
return function(e, t, n, a) {
function r(e, t, a) {
0 !== e && (1 !== e ? s.push(e + " " + a) : n ? s.push(t) : s.push("1 " + t));
}
if (!e) return e;
a = a || 2, t = t || new Date();
var o = moment(t).diff(e);
o < 0 && (o = 0);
var i = moment.duration(o), s = [], c = i.years(), l = i.months(), u = i.days(), d = i.hours(), m = i.minutes(), p = i.seconds();
return r(c, "year", "years"), r(l, "month", "months"), r(u, "day", "days"), r(d, "hour", "hours"), r(m, "minute", "minutes"), r(p, "second", "seconds"), 1 === s.length && p && 1 === a ? n ? "minute" : "1 minute" : (0 === s.length && s.push("0 seconds"), s.length > a && (s.length = a), s.join(", "));
};
}).filter("ageLessThan", function() {
return function(e, t, n) {
return moment().subtract(t, n).diff(moment(e)) < 0;
};
}).filter("humanizeDurationValue", function() {
return function(e, t) {
return moment.duration(e, t).humanize();
};
}).filter("timeOnlyDurationFromTimestamps", [ "timeOnlyDurationFilter", function(e) {
return function(t, n) {
return t ? (n = n || new Date(), e(moment(n).diff(t))) : t;
};
} ]).filter("countdownToTimestamp", function() {
return function(e) {
var t = moment(new Date(e)).diff(moment(), "seconds");
return t < 0 ? 0 : t;
};
}).filter("timeOnlyDuration", function() {
return function(e) {
var t = [], n = moment.duration(e), a = Math.floor(n.asHours()), r = n.minutes(), o = n.seconds();
return (a < 0 || r < 0 || o < 0) && (a = r = o = 0), a && t.push(a + "h"), r && t.push(r + "m"), a || t.push(o + "s"), t.join(" ");
};
}), angular.module("openshiftConsole").filter("storageClass", [ "annotationFilter", function(e) {
return function(t) {
return e(t, "volume.beta.kubernetes.io/storage-class");
};
} ]).filter("storageClassAccessMode", [ "annotationFilter", function(e) {
return function(t) {
return e(t, "storage.alpha.openshift.io/access-mode");
};
} ]).filter("tags", [ "annotationFilter", function(e) {
return function(t, n) {
var a = e(t, n = n || "tags");
return a ? a.split(/\s*,\s*/) : [];
};
} ]).filter("imageStreamLastUpdated", function() {
return function(e) {
var t = e.metadata.creationTimestamp, n = moment(t);
return angular.forEach(e.status.tags, function(e) {
if (!_.isEmpty(e.items)) {
var a = moment(_.head(e.items).created);
a.isAfter(n) && (n = a, t = _.head(e.items).created);
}
}), t;
};
}).filter("buildConfigForBuild", [ "annotationFilter", "labelNameFilter", "labelFilter", function(e, t, n) {
var a = t("buildConfig");
return function(t) {
return e(t, "buildConfig") || n(t, a);
};
} ]).filter("icon", [ "annotationFilter", function(e) {
return function(t) {
var n = e(t, "icon");
return n || "";
};
} ]).filter("iconClass", [ "annotationFilter", function(e) {
return function(t, n) {
var a = e(t, "iconClass");
return a || ("template" === n ? "fa fa-clone" : "");
};
} ]).filter("imageName", function() {
return function(e) {
return e ? e.contains(":") ? e.split(":")[1] : e : "";
};
}).filter("imageStreamName", function() {
return function(e) {
if (!e) return "";
var t, n = e.split("@")[0], a = n.split("/");
return 3 === a.length ? (t = a[2].split(":"), a[1] + "/" + t[0]) : 2 === a.length ? n : 1 === a.length ? (t = n.split(":"))[0] : void 0;
};
}).filter("stripTag", function() {
return function(e) {
return e ? e.split(":")[0] : e;
};
}).filter("stripSHA", function() {
return function(e) {
return e ? e.split("@")[0] : e;
};
}).filter("imageSHA", function() {
return function(e) {
if (!e) return e;
var t = e.split("@");
return t.length > 1 ? t[1] : "";
};
}).filter("imageEnv", function() {
return function(e, t) {
for (var n = e.dockerImageMetadata.Config.Env, a = 0; a < _.size(n); a++) {
var r = n[a].split("=");
if (r[0] === t) return r[1];
}
return null;
};
}).filter("destinationSourcePair", function() {
return function(e) {
var t = {};
return angular.forEach(e, function(e) {
t[e.sourcePath] = e.destinationDir;
}), t;
};
}).filter("buildForImage", function() {
return function(e, t) {
for (var n = _.get(e, "dockerImageMetadata.Config.Env", []), a = 0; a < n.length; a++) {
var r = n[a].split("=");
if ("OPENSHIFT_BUILD_NAME" === r[0]) return t[r[1]];
}
return null;
};
}).filter("webhookURL", [ "canIFilter", "APIService", "DataService", "SecretsService", function(e, t, n, a) {
return function(r, o, i, s, c) {
var l = t.getPreferredVersion("secrets");
return e(l, "list") ? (i = a.getWebhookSecretValue(i, c), n.url({
resource: "buildconfigs/webhooks/" + encodeURIComponent(i) + "/" + encodeURIComponent(o.toLowerCase()),
name: r,
namespace: s,
group: "build.openshift.io"
})) : n.url({
resource: "buildconfigs/webhooks/",
name: r,
namespace: s,
group: "build.openshift.io"
}) + "<secret>/" + o.toLowerCase();
};
} ]).filter("isWebRoute", [ "routeHostFilter", function(e) {
return function(t) {
return !!e(t, !0) && "Subdomain" !== _.get(t, "spec.wildcardPolicy");
};
} ]).filter("routeWebURL", [ "routeHostFilter", function(e) {
return function(t, n, a) {
var r = (t.spec.tls && "" !== t.spec.tls.tlsTerminationType ? "https" : "http") + "://" + (n || e(t));
return t.spec.path && !a && (r += t.spec.path), r;
};
} ]).filter("routeLabel", [ "RoutesService", "routeHostFilter", "routeWebURLFilter", "isWebRouteFilter", function(e, t, n, a) {
return function(r, o, i) {
if (a(r)) return n(r, o, i);
var s = o || t(r);
return s ? ("Subdomain" === _.get(r, "spec.wildcardPolicy") && (s = "*." + e.getSubdomain(r)), i ? s : (r.spec.path && (s += r.spec.path), s)) : "<unknown host>";
};
} ]).filter("parameterPlaceholder", function() {
return function(e) {
return e.generate ? "(generated if empty)" : "";
};
}).filter("parameterValue", function() {
return function(e) {
return !e.value && e.generate ? "(generated)" : e.value;
};
}).filter("imageObjectRef", function() {
return function(e, t, n) {
if (!e) return "";
var a = e.namespace || t || "";
_.isEmpty(a) || (a += "/");
var r = e.kind;
if ("ImageStreamTag" === r || "ImageStreamImage" === r) return a + e.name;
if ("DockerImage" === r) {
var o = e.name;
return n && (o = o.substring(o.lastIndexOf("/") + 1)), o;
}
return a + e.name;
};
}).filter("orderByDisplayName", [ "displayNameFilter", "toArrayFilter", function(e, t) {
return function(n) {
var a = t(n);
return a.sort(function(t, n) {
var a = e(t) || "", r = e(n) || "";
return a === r && (a = _.get(t, "metadata.name", ""), r = _.get(n, "metadata.name", "")), a.localeCompare(r);
}), a;
};
} ]).filter("isContainerLooping", function() {
return function(e) {
return e.state.waiting && "CrashLoopBackOff" === e.state.waiting.reason;
};
}).filter("isContainerFailed", function() {
return function(e) {
return e.state.terminated && 0 !== e.state.terminated.exitCode;
};
}).filter("isContainerTerminatedSuccessfully", function() {
return function(e) {
return e.state.terminated && 0 === e.state.terminated.exitCode;
};
}).filter("isContainerUnprepared", function() {
return function(e) {
if (!e.state.running || !1 !== e.ready || !e.state.running.startedAt) return !1;
var t = moment().subtract(5, "m");
return moment(e.state.running.startedAt).isBefore(t);
};
}).filter("isTroubledPod", [ "isContainerLoopingFilter", "isContainerFailedFilter", "isContainerUnpreparedFilter", function(e, t, n) {
return function(a) {
if ("Unknown" === a.status.phase) return !0;
if ("Running" === a.status.phase && a.status.containerStatuses) {
var r;
for (r = 0; r < _.size(a.status.containerStatuses); ++r) {
var o = a.status.containerStatuses[r];
if (o.state) {
if (t(o)) return !0;
if (e(o)) return !0;
if (n(o)) return !0;
}
}
}
return !1;
};
} ]).filter("podWarnings", [ "isContainerLoopingFilter", "isContainerFailedFilter", "isContainerUnpreparedFilter", "isTerminatingFilter", function(e, t, n, a) {
return function(r) {
var o = [];
return "Unknown" === r.status.phase && o.push({
reason: "Unknown",
pod: r.metadata.name,
message: "The state of the pod could not be obtained. This is typically due to an error communicating with the host of the pod."
}), "Running" === r.status.phase && r.status.containerStatuses && _.each(r.status.containerStatuses, function(i) {
if (!i.state) return !1;
t(i) && (a(r) ? o.push({
severity: "error",
reason: "NonZeroExitTerminatingPod",
pod: r.metadata.name,
container: i.name,
message: "The container " + i.name + " did not stop cleanly when terminated (exit code " + i.state.terminated.exitCode + ")."
}) : o.push({
severity: "warning",
reason: "NonZeroExit",
pod: r.metadata.name,
container: i.name,
message: "The container " + i.name + " failed (exit code " + i.state.terminated.exitCode + ")."
})), e(i) && o.push({
severity: "error",
reason: "Looping",
pod: r.metadata.name,
container: i.name,
message: "The container " + i.name + " is crashing frequently. It must wait before it will be restarted again."
}), n(i) && o.push({
severity: "warning",
reason: "Unprepared",
pod: r.metadata.name,
container: i.name,
message: "The container " + i.name + " has been running for more than five minutes and has not passed its readiness check."
});
}), o.length > 0 ? o : null;
};
} ]).filter("groupedPodWarnings", [ "podWarningsFilter", function(e) {
return function(t, n) {
var a = n || {};
return _.each(t, function(t) {
var n = e(t);
_.each(n, function(e) {
var t = e.reason + (e.container || "");
a[t] = a[t] || [], a[t].push(e);
});
}), a;
};
} ]).filter("troubledPods", [ "isTroubledPodFilter", function(e) {
return function(t) {
var n = [];
return angular.forEach(t, function(t) {
e(t) && n.push(t);
}), n;
};
} ]).filter("notTroubledPods", [ "isTroubledPodFilter", function(e) {
return function(t) {
var n = [];
return angular.forEach(t, function(t) {
e(t) || n.push(t);
}), n;
};
} ]).filter("projectOverviewURL", [ "Navigate", function(e) {
return function(t) {
return angular.isString(t) ? e.projectOverviewURL(t) : angular.isObject(t) ? e.projectOverviewURL(t.metadata && t.metadata.name) : e.projectOverviewURL("");
};
} ]).filter("catalogURL", [ "Navigate", function(e) {
return e.catalogURL;
} ]).filter("createFromSourceURL", function() {
return function(e, t) {
return URI.expand("project/{project}/catalog/images{?q*}", {
project: e,
q: {
builderfor: t
}
}).toString();
};
}).filter("createFromImageURL", [ "Navigate", function(e) {
return function(t, n, a, r) {
return e.createFromImageURL(t, n, a, r);
};
} ]).filter("createFromTemplateURL", [ "Navigate", function(e) {
return function(t, n, a) {
return e.createFromTemplateURL(t, n, a);
};
} ]).filter("failureObjectName", function() {
return function(e) {
if (!e.data || !e.data.details) return null;
var t = e.data.details;
return t.kind ? t.id ? t.kind + " " + t.id : t.kind : t.id;
};
}).filter("isIncompleteBuild", [ "ageLessThanFilter", function(e) {
return function(e) {
if (!e || !e.status || !e.status.phase) return !1;
switch (e.status.phase) {
case "New":
case "Pending":
case "Running":
return !0;

default:
return !e.status.completionTimestamp;
}
};
} ]).filter("isRecentBuild", [ "ageLessThanFilter", "isIncompleteBuildFilter", function(e, t) {
return function(n) {
if (!(n && n.status && n.status.phase && n.metadata)) return !1;
if (t(n)) return !0;
var a = n.status.completionTimestamp || n.metadata.creationTimestamp;
return e(a, 5, "minutes");
};
} ]).filter("deploymentCauses", [ "annotationFilter", function(e) {
return function(t) {
if (!t) return [];
var n = e(t, "encodedDeploymentConfig");
if (!n) return [];
try {
var a = $.parseJSON(n);
if (!a) return [];
switch (a.apiVersion) {
case "v1beta1":
return a.details.causes;

case "v1beta3":
case "v1":
return a.status.details ? a.status.details.causes : [];

default:
return Logger.error('Unknown API version "' + a.apiVersion + '" in encoded deployment config for deployment ' + t.metadata.name), a.status && a.status.details && a.status.details.causes ? a.status.details.causes : [];
}
} catch (e) {
return Logger.error("Failed to parse encoded deployment config", e), [];
}
};
} ]).filter("desiredReplicas", function() {
return function(e) {
return e && e.spec ? void 0 === e.spec.replicas ? 1 : e.spec.replicas : 0;
};
}).filter("serviceImplicitDNSName", function() {
return function(e) {
return e && e.metadata && e.metadata.name && e.metadata.namespace ? e.metadata.name + "." + e.metadata.namespace + ".svc" : "";
};
}).filter("podsForPhase", function() {
return function(e, t) {
var n = [];
return angular.forEach(e, function(e) {
e.status.phase === t && n.push(e);
}), n;
};
}).filter("numContainersReady", function() {
return function(e) {
var t = 0;
return angular.forEach(e.status.containerStatuses, function(e) {
e.ready && t++;
}), t;
};
}).filter("numContainerRestarts", function() {
return function(e) {
var t = 0;
return angular.forEach(e.status.containerStatuses, function(e) {
t += e.restartCount;
}), t;
};
}).filter("isTerminating", function() {
return function(e) {
return _.has(e, "metadata.deletionTimestamp");
};
}).filter("isPullingImage", function() {
return function(e) {
if (!e) return !1;
if ("Pending" !== _.get(e, "status.phase")) return !1;
var t = _.get(e, "status.containerStatuses");
if (!t) return !1;
return _.some(t, function(e) {
return "ContainerCreating" === _.get(e, "state.waiting.reason");
});
};
}).filter("newestResource", function() {
return function(e) {
var t = null;
return angular.forEach(e, function(e) {
if (t) moment(t.metadata.creationTimestamp).isBefore(e.metadata.creationTimestamp) && (t = e); else {
if (!e.metadata.creationTimestamp) return;
t = e;
}
}), t;
};
}).filter("deploymentIsLatest", [ "annotationFilter", function(e) {
return function(t, n) {
return !(!n || !t) && parseInt(e(t, "deploymentVersion")) === n.status.latestVersion;
};
} ]).filter("deploymentStatus", [ "annotationFilter", "hasDeploymentConfigFilter", function(e, t) {
return function(n) {
if (e(n, "deploymentCancelled")) return "Cancelled";
var a = e(n, "deploymentStatus");
return !t(n) || "Complete" === a && n.spec.replicas > 0 ? "Active" : a;
};
} ]).filter("deploymentIsInProgress", [ "deploymentStatusFilter", function(e) {
return function(t) {
return [ "New", "Pending", "Running" ].indexOf(e(t)) > -1;
};
} ]).filter("anyDeploymentIsInProgress", [ "deploymentIsInProgressFilter", function(e) {
return function(t) {
return _.some(t, e);
};
} ]).filter("getActiveDeployment", [ "DeploymentsService", function(e) {
return function(t) {
return e.getActiveDeployment(t);
};
} ]).filter("isRecentDeployment", [ "deploymentIsLatestFilter", "deploymentIsInProgressFilter", function(e, t) {
return function(n, a) {
return !!e(n, a) || !!t(n);
};
} ]).filter("buildStrategy", function() {
return function(e) {
if (!e || !e.spec || !e.spec.strategy) return null;
switch (e.spec.strategy.type) {
case "Source":
return e.spec.strategy.sourceStrategy;

case "Docker":
return e.spec.strategy.dockerStrategy;

case "Custom":
return e.spec.strategy.customStrategy;

case "JenkinsPipeline":
return e.spec.strategy.jenkinsPipelineStrategy;

default:
return null;
}
};
}).filter("isBinaryBuild", function() {
return function(e) {
return _.has(e, "spec.source.binary");
};
}).filter("isJenkinsPipelineStrategy", function() {
return function(e) {
return "JenkinsPipeline" === _.get(e, "spec.strategy.type");
};
}).filter("jenkinsLogURL", [ "annotationFilter", function(e) {
return function(t, n) {
var a = e(t, "jenkinsLogURL");
return !a || n ? a : a.replace(/\/consoleText$/, "/console");
};
} ]).filter("jenkinsBuildURL", [ "annotationFilter", "jenkinsLogURLFilter", function(e, t) {
return function(t) {
return e(t, "jenkinsBuildURL");
};
} ]).filter("jenkinsInputURL", [ "jenkinsBuildURLFilter", function(e) {
return function(t) {
var n = e(t);
return n ? new URI(n).segment("/input/").toString() : null;
};
} ]).filter("buildLogURL", [ "isJenkinsPipelineStrategyFilter", "jenkinsLogURLFilter", "navigateResourceURLFilter", function(e, t, n) {
return function(a) {
if (e(a)) return t(a);
var r = n(a);
return r ? new URI(r).addSearch("tab", "logs").toString() : null;
};
} ]).filter("jenkinsfileLink", [ "isJenkinsPipelineStrategyFilter", "githubLinkFilter", function(e, t) {
return function(n) {
if (!e(n) || _.has(n, "spec.strategy.jenkinsPipelineStrategy.jenkinsfile")) return "";
var a = _.get(n, "spec.source.git.uri");
if (!a) return "";
var r = _.get(n, "spec.source.git.ref"), o = _.get(n, "spec.strategy.jenkinsPipelineStrategy.jenkinsfilePath", "Jenkinsfile"), i = _.get(n, "spec.source.contextDir");
i && (o = URI.joinPaths(i, o).path());
var s = t(a, r, o);
return URI(s).is("url") ? s : "";
};
} ]).filter("pipelineStageComplete", function() {
return function(e) {
return !!e && -1 !== _.indexOf([ "ABORTED", "FAILED", "SUCCESS" ], e.status);
};
}).filter("pipelineStagePendingInput", function() {
return function(e) {
return !!e && "PAUSED_PENDING_INPUT" === e.status;
};
}).filter("deploymentStrategyParams", function() {
return function(e) {
switch (_.get(e, "spec.strategy.type")) {
case "Recreate":
return _.get(e, "spec.strategy.recreateParams", {});

case "Rolling":
return _.get(e, "spec.strategy.rollingParams", {});

case "Custom":
return _.get(e, "spec.strategy.customParams", {});

default:
return null;
}
};
}).filter("humanizeTLSTermination", function() {
return function(e) {
switch (e) {
case "edge":
return "Edge";

case "passthrough":
return "Passthrough";

case "reencrypt":
return "Re-encrypt";

default:
return e;
}
};
}).filter("kindToResource", [ "APIService", function(e) {
return e.kindToResource;
} ]).filter("abbreviateResource", [ "APIService", function(e) {
var t = {
buildconfigs: "bc",
deploymentconfigs: "dc",
horizontalpodautoscalers: "hpa",
imagestreams: "is",
imagestreamtags: "istag",
replicasets: "rs",
replicationcontrollers: "rc",
services: "svc"
};
return function(e) {
return t[e] || e;
};
} ]).filter("humanizeQuotaResource", function() {
return function(e, t) {
if (!e) return e;
var n = {
configmaps: "Config Maps",
cpu: "CPU (Request)",
"limits.cpu": "CPU (Limit)",
"limits.memory": "Memory (Limit)",
memory: "Memory (Request)",
"openshift.io/imagesize": "Image Size",
"openshift.io/imagestreamsize": "Image Stream Size",
"openshift.io/projectimagessize": "Project Image Size",
persistentvolumeclaims: "Persistent Volume Claims",
"requests.storage": "Storage (Request)",
pods: "Pods",
replicationcontrollers: "Replication Controllers",
"requests.cpu": "CPU (Request)",
"requests.memory": "Memory (Request)",
resourcequotas: "Resource Quotas",
secrets: "Secrets",
services: "Services",
"services.loadbalancers": "Service Load Balancers",
"services.nodeports": "Service Node Ports"
}, a = {
configmaps: "config maps",
cpu: "CPU (request)",
"limits.cpu": "CPU (limit)",
"limits.memory": "memory (limit)",
memory: "memory (request)",
"openshift.io/imagesize": "image size",
"openshift.io/imagestreamsize": "image stream size",
"openshift.io/projectimagessize": "project image size",
persistentvolumeclaims: "persistent volume claims",
"requests.storage": "storage (request)",
replicationcontrollers: "replication controllers",
"requests.cpu": "CPU (request)",
"requests.memory": "memory (request)",
resourcequotas: "resource quotas",
"services.loadbalancers": "service load balancers",
"services.nodeports": "service node ports"
};
return t ? n[e] || e : a[e] || e;
};
}).filter("routeTargetPortMapping", [ "RoutesService", function(e) {
var t = function(e, t, n) {
var a = "Service Port " + (e = e || "<unknown>") + " → Container Port " + (t = t || "<unknown>");
return n && (a += " (" + n + ")"), a;
};
return function(n, a) {
if (!n.spec.port || !n.spec.port.targetPort || !a) return "";
var r = n.spec.port.targetPort, o = e.getServicePortForRoute(r, a);
return o ? t(o.port, o.targetPort, o.protocol) : angular.isString(r) ? t(r, null) : t(null, r);
};
} ]).filter("podStatus", function() {
return function(e) {
if (!e || !e.metadata.deletionTimestamp && !e.status) return "";
if (e.metadata.deletionTimestamp) return "Terminating";
var t, n = !1;
return _.each(e.status.initContainerStatuses, function(e) {
var a = _.get(e, "state");
if (!a.terminated || 0 !== a.terminated.exitCode) return a.terminated ? (t = a.terminated.reason ? "Init " + a.terminated.reason : a.terminated.signal ? "Init Signal: " + a.terminated.signal : "Init Exit Code: " + a.terminated.exitCode, n = !0, !0) : void (a.waiting && a.waiting.reason && "PodInitializing" !== a.waiting.reason && (t = "Init " + a.waiting.reason, n = !0));
}), n || (t = e.status.reason || e.status.phase, _.each(e.status.containerStatuses, function(e) {
var n, a, r = _.get(e, "state.waiting.reason") || _.get(e, "state.terminated.reason");
return r ? (t = r, !0) : (n = _.get(e, "state.terminated.signal")) ? (t = "Signal: " + n, !0) : (a = _.get(e, "state.terminated.exitCode")) ? (t = "Exit Code: " + a, !0) : void 0;
})), t;
};
}).filter("podStartTime", function() {
return function(e) {
var t = null;
return _.each(_.get(e, "status.containerStatuses"), function(e) {
var n = _.get(e, "state.running") || _.get(e, "state.terminated");
n && (t && !moment(n.startedAt).isBefore(t) || (t = n.startedAt));
}), t;
};
}).filter("podCompletionTime", function() {
return function(e) {
var t = null;
return _.each(_.get(e, "status.containerStatuses"), function(e) {
var n = _.get(e, "state.terminated");
n && (t && !moment(n.finishedAt).isAfter(t) || (t = n.finishedAt));
}), t;
};
}).filter("routeIngressCondition", function() {
return function(e, t) {
return e ? _.find(e.conditions, {
type: t
}) : null;
};
}).filter("routeHost", function() {
return function(e, t) {
if (!_.get(e, "status.ingress")) return _.get(e, "spec.host");
if (!e.status.ingress) return e.spec.host;
var n = null;
return angular.forEach(e.status.ingress, function(e) {
_.some(e.conditions, {
type: "Admitted",
status: "True"
}) && (!n || n.lastTransitionTime > e.lastTransitionTime) && (n = e);
}), n ? n.host : t ? null : e.spec.host;
};
}).filter("isRequestCalculated", [ "LimitRangesService", function(e) {
return function(t, n) {
return e.isRequestCalculated(t, n);
};
} ]).filter("isLimitCalculated", [ "LimitRangesService", function(e) {
return function(t, n) {
return e.isLimitCalculated(t, n);
};
} ]).filter("podTemplate", function() {
return function(e) {
return e ? "Pod" === e.kind ? e : _.get(e, "spec.template") : null;
};
}).filter("hasHealthChecks", function() {
return function(e) {
var t = _.get(e, "spec.containers", []);
return _.every(t, function(e) {
return e.readinessProbe || e.livenessProbe;
});
};
}).filter("scopeDetails", [ "sentenceCaseFilter", function(e) {
var t = {
Terminating: "Affects pods that have an active deadline. These pods usually include builds, deployers, and jobs.",
NotTerminating: "Affects pods that do not have an active deadline. These pods usually include your applications.",
BestEffort: "Affects pods that do not have resource limits set. These pods have a best effort quality of service.",
NotBestEffort: "Affects pods that have at least one resource limit set. These pods do not have a best effort quality of service."
};
return function(n) {
return t[n] || e(n);
};
} ]).filter("isDebugPod", [ "annotationFilter", function(e) {
return function(t) {
return !!e(t, "debug.openshift.io/source-resource");
};
} ]).filter("debugPodSourceName", [ "annotationFilter", function(e) {
return function(t) {
var n = e(t, "debug.openshift.io/source-resource");
if (!n) return "";
var a = n.split("/");
return 2 !== a.length ? (Logger.warn('Invalid debug.openshift.io/source-resource annotation value "' + n + '"'), "") : a[1];
};
} ]).filter("entrypoint", function() {
var e = function(e) {
return _.isArray(e) ? e.join(" ") : e;
};
return function(t, n) {
if (!t) return null;
var a, r = e(t.command), o = e(t.args);
if (r && o) return r + " " + o;
if (r) return r;
if (n) {
if (a = e(_.get(n, "dockerImageMetadata.Config.Entrypoint") || [ "/bin/sh", "-c" ]), o) return a + " " + o;
if (r = e(_.get(n, "dockerImageMetadata.Config.Cmd"))) return a + " " + r;
}
return o ? "<image-entrypoint> " + o : null;
};
}).filter("unidleTargetReplicas", [ "annotationFilter", function(e) {
return function(t, n) {
var a;
if (t) try {
a = parseInt(e(t, "idledPreviousScale"));
} catch (e) {
Logger.error("Unable to parse previous scale annotation as a number.");
}
return a || _.get(_.head(n), "spec.minReplicas") || 1;
};
} ]).filter("lastDeploymentRevision", [ "annotationFilter", function(e) {
return function(t) {
if (!t) return "";
var n = e(t, "deployment.kubernetes.io/revision");
return n ? "#" + n : "Unknown";
};
} ]).filter("hasPostCommitHook", function() {
return function(e) {
return _.has(e, "spec.postCommit.command") || _.has(e, "spec.postCommit.script") || _.has(e, "spec.postCommit.args");
};
}).filter("volumeMountMode", function() {
var e = function(e) {
return _.has(e, "configMap") || _.has(e, "secret");
};
return function(t, n) {
if (!t) return "";
var a = _.find(n, {
name: t.name
});
return e(a) ? "read-only" : _.get(a, "persistentVolumeClaim.readOnly") ? "read-only" : t.readOnly ? "read-only" : "read-write";
};
}).filter("managesRollouts", [ "APIService", function(e) {
return function(t) {
if (!t) return !1;
var n = e.objectToResourceGroupVersion(t);
return "deploymentconfigs" === n.resource && !n.group || "deployments" === n.resource && ("apps" === n.group || "extensions" === n.group);
};
} ]).filter("hasAlternateBackends", function() {
return function(e) {
var t = _.get(e, "spec.alternateBackends", []);
return !_.isEmpty(t);
};
}).filter("readyConditionMessage", [ "statusConditionFilter", function(e) {
return function(t) {
return _.get(e(t, "Ready"), "message");
};
} ]).filter("failedConditionMessage", [ "statusConditionFilter", function(e) {
return function(t) {
return _.get(e(t, "Failed"), "message");
};
} ]).filter("serviceInstanceConditionMessage", [ "serviceInstanceStatusFilter", "statusConditionFilter", function(e, t) {
return function(n) {
var a = e(n), r = null;
switch (a) {
case "Failed":
case "Ready":
r = _.get(t(n, a), "message");
}
return r;
};
} ]).filter("humanizeReason", function() {
return function(e) {
return _.startCase(e).replace("Back Off", "Back-off").replace("O Auth", "OAuth");
};
}).filter("humanizePodStatus", [ "humanizeReasonFilter", function(e) {
return e;
} ]).filter("donutURL", [ "navigateResourceURLFilter", function(e) {
return function(t, n) {
return 1 === _.size(n) ? e(_.sample(n)) : _.size(n) > 1 ? e(t) : void 0;
};
} ]), angular.module("openshiftConsole").filter("canIDoAny", [ "APIService", "canIFilter", function(e, t) {
var n = {
buildConfigs: [ {
group: "",
resource: "buildconfigs",
verbs: [ "delete", "update" ]
}, {
group: "",
resource: "buildconfigs/instantiate",
verbs: [ "create" ]
} ],
builds: [ _.assign({}, e.getPreferredVersion("builds/clone"), {
verbs: [ "create" ]
}), _.assign({}, e.getPreferredVersion("builds"), {
verbs: [ "delete", "update" ]
}) ],
configmaps: [ {
group: "",
resource: "configmaps",
verbs: [ "update", "delete" ]
} ],
deployments: [ _.assign({}, e.getPreferredVersion("horizontalpodautoscalers"), {
verbs: [ "create", "update" ]
}), _.assign({}, e.getPreferredVersion("deployments"), {
verbs: [ "update", "delete" ]
}) ],
deploymentConfigs: [ _.assign({}, e.getPreferredVersion("horizontalpodautoscalers"), {
verbs: [ "create", "update" ]
}), _.assign({}, e.getPreferredVersion("deploymentconfigs"), {
verbs: [ "create", "update" ]
}) ],
horizontalPodAutoscalers: [ {
group: "autoscaling",
resource: "horizontalpodautoscalers",
verbs: [ "update", "delete" ]
} ],
imageStreams: [ _.assign({}, e.getPreferredVersion("imagestreams"), {
verbs: [ "update", "delete" ]
}) ],
serviceInstances: [ _.assign({}, e.getPreferredVersion("serviceinstances"), {
verbs: [ "update", "delete" ]
}) ],
persistentVolumeClaims: [ {
group: "",
resource: "persistentvolumeclaims",
verbs: [ "update", "delete" ]
} ],
pods: [ {
group: "",
resource: "pods",
verbs: [ "update", "delete" ]
}, {
group: "",
resource: "deploymentconfigs",
verbs: [ "update" ]
} ],
replicaSets: [ {
group: "autoscaling",
resource: "horizontalpodautoscalers",
verbs: [ "create", "update" ]
}, {
group: "extensions",
resource: "replicasets",
verbs: [ "update", "delete" ]
} ],
replicationControllers: [ {
group: "",
resource: "replicationcontrollers",
verbs: [ "update", "delete" ]
} ],
routes: [ {
group: "",
resource: "routes",
verbs: [ "update", "delete" ]
} ],
services: [ {
group: "",
resource: "services",
verbs: [ "update", "create", "delete" ]
} ],
secrets: [ {
group: "",
resource: "secrets",
verbs: [ "update", "delete" ]
} ],
projects: [ {
group: "",
resource: "projects",
verbs: [ "delete", "update" ]
} ],
statefulsets: [ {
group: "apps",
resource: "statefulsets",
verbs: [ "update", "delete" ]
} ]
};
return function(e) {
return _.some(n[e], function(e) {
return _.some(e.verbs, function(n) {
return t({
resource: e.resource,
group: e.group
}, n);
});
});
};
} ]).filter("canIScale", [ "canIFilter", "hasDeploymentConfigFilter", "DeploymentsService", function(e, t, n) {
return function(t) {
var a = n.getScaleResource(t);
return e(a, "update");
};
} ]), angular.module("openshiftConsole").filter("underscore", function() {
return function(e) {
return e.replace(/\./g, "_");
};
}).filter("defaultIfBlank", function() {
return function(e, t) {
return null === e ? t : ("string" != typeof e && (e = String(e)), 0 === e.trim().length ? t : e);
};
}).filter("keys", function() {
return _.keys;
}).filter("usageValue", function() {
return function(e) {
if (!e) return e;
var t = /(-?[0-9\.]+)\s*(.*)/.exec(e);
if (!t) return e;
var n = t[1];
n = n.indexOf(".") >= 0 ? parseFloat(n) : parseInt(t[1]);
var a = 1;
switch (t[2]) {
case "E":
a = Math.pow(1e3, 6);
break;

case "P":
a = Math.pow(1e3, 5);
break;

case "T":
a = Math.pow(1e3, 4);
break;

case "G":
a = Math.pow(1e3, 3);
break;

case "M":
a = Math.pow(1e3, 2);
break;

case "K":
case "k":
a = 1e3;
break;

case "m":
a = .001;
break;

case "Ei":
a = Math.pow(1024, 6);
break;

case "Pi":
a = Math.pow(1024, 5);
break;

case "Ti":
a = Math.pow(1024, 4);
break;

case "Gi":
a = Math.pow(1024, 3);
break;

case "Mi":
a = Math.pow(1024, 2);
break;

case "Ki":
a = 1024;
}
return n * a;
};
}).filter("humanizeUnit", function() {
return function(e, t, n) {
switch (t) {
case "memory":
case "limits.memory":
case "requests.memory":
case "storage":
return e ? e + "B" : e;

case "cpu":
case "limits.cpu":
case "requests.cpu":
"m" === e && (e = "milli");
var a = n ? "core" : "cores";
return (e || "") + a;

default:
return e;
}
};
}).filter("amountAndUnit", [ "humanizeUnitFilter", function(e) {
return function(t, n, a) {
if (!t) return [ t, null ];
var r = /(-?[0-9\.]+)\s*(.*)/.exec(t);
if (!r) return [ t, null ];
var o = r[1], i = r[2];
return a && (i = e(i, n, "1" === o)), [ o, i ];
};
} ]).filter("usageWithUnits", [ "amountAndUnitFilter", function(e) {
return function(t, n) {
return _.spread(function(e, t) {
return t ? e + " " + t : e;
})(e(t, n, !0));
};
} ]).filter("humanizeSize", function() {
return function(e) {
if (null === e || void 0 === e || "" === e) return e;
if ((e = Number(e)) < 1024) return e + " bytes";
var t = e / 1024;
if (t < 1024) return t.toFixed(1) + " KiB";
var n = t / 1024;
return n < 1024 ? n.toFixed(1) + " MiB" : (n / 1024).toFixed(1) + " GiB";
};
}).filter("computeResourceLabel", function() {
return function(e, t) {
switch (e) {
case "cpu":
return "CPU";

case "memory":
return t ? "Memory" : "memory";

default:
return e;
}
};
}).filter("helpLink", [ "Constants", function(e) {
return function(t) {
var n = e.HELP[t] || e.HELP.default;
return URI(n).is("absolute") || (n = e.HELP_BASE_URL + n), n;
};
} ]).filter("taskTitle", function() {
return function(e) {
return "completed" !== e.status ? e.titles.started : e.hasErrors ? e.titles.failure : e.titles.success;
};
}).filter("httpHttps", function() {
return function(e) {
return e ? "https://" : "http://";
};
}).filter("isGithubLink", function() {
var e = /^(?:https?:\/\/|git:\/\/|git\+ssh:\/\/|git\+https:\/\/)?(?:[^@]+@)?github\.com[:\/]([^\/]+\/[^\/]+?)(\/|(?:\.git(#.*)?))?$/;
return function(t) {
return t ? e.test(t) : t;
};
}).filter("githubLink", function() {
return function(e, t, n) {
var a = e.match(/^(?:https?:\/\/|git:\/\/|git\+ssh:\/\/|git\+https:\/\/)?(?:[^@]+@)?github\.com[:\/]([^\/]+\/[^\/]+?)(\/|(?:\.git(#.*)?))?$/);
return a && (e = "https://github.com/" + a[1], n && "/" === n.charAt(0) && (n = n.substring(1)), n ? (n = (n = encodeURIComponent(n)).replace("%2F", "/"), e += "/tree/" + encodeURIComponent(t || "master") + "/" + n) : t && "master" !== t && (e += "/tree/" + encodeURIComponent(t))), e;
};
}).filter("yesNo", function() {
return function(e) {
return e ? "Yes" : "No";
};
}).filter("valuesIn", function() {
return function(e, t) {
if (!t) return {};
var n = t.split(","), a = {};
return angular.forEach(e, function(e, t) {
-1 !== n.indexOf(t) && (a[t] = e);
}), a;
};
}).filter("valuesNotIn", function() {
return function(e, t) {
if (!t) return e;
var n = t.split(","), a = {};
return angular.forEach(e, function(e, t) {
-1 === n.indexOf(t) && (a[t] = e);
}), a;
};
}).filter("stripSHAPrefix", function() {
return function(e) {
return e ? e.replace(/^sha256:/, "") : e;
};
}).filter("limitToOrAll", [ "limitToFilter", function(e) {
return function(t, n) {
return isNaN(n) ? t : e(t, n);
};
} ]).filter("getWebhookSecretData", function() {
return function(e) {
var t = _.get(e, "data.type");
return t ? _.get(e, [ "data", _.toLower(t) ]) : null;
};
}).filter("getErrorDetails", function() {
return function(e) {
var t = e.data || {};
if (t.message) return "Reason: " + t.message;
var n = e.status || t.status;
return n ? "Status: " + n : "";
};
}).filter("humanize", function() {
return function(e) {
return e.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/\b([A-Z]+)([A-Z])([a-z])/, "$1 $2$3").replace(/^./, function(e) {
return e.toUpperCase();
});
};
}).filter("navigateResourceURL", [ "Navigate", function(e) {
return function(t, n, a, r) {
return e.resourceURL(t, n, a, null, {
apiVersion: r
});
};
} ]).filter("navigateEventInvolvedObjectURL", [ "Navigate", function(e) {
return function(t) {
return e.resourceURL(t.involvedObject.name, t.involvedObject.kind, t.involvedObject.namespace, null, {
apiVersion: t.involvedObject.apiVersion
});
};
} ]).filter("navigateToTabURL", [ "Navigate", function(e) {
return function(t, n) {
return e.resourceURL(t, null, null, null, {
tab: n
});
};
} ]).filter("configURLForResource", [ "Navigate", function(e) {
return function(t, n) {
return e.configURLForResource(t, n);
};
} ]).filter("editResourceURL", [ "Navigate", function(e) {
return function(t, n, a) {
return e.resourceURL(t, n, a, "edit");
};
} ]).filter("editYamlURL", [ "Navigate", function(e) {
return function(t, n) {
return e.yamlURL(t, n);
};
} ]).filter("join", function() {
return function(e, t) {
return t || (t = ","), e.join(t);
};
}).filter("accessModes", function() {
return function(e, t) {
if (!e) return e;
var n = [];
return angular.forEach(e, function(e) {
var a, r = "long" === t;
switch (e) {
case "ReadWriteOnce":
a = r ? "RWO (Read-Write-Once)" : "Read-Write-Once";
break;

case "ReadOnlyMany":
a = r ? "ROX (Read-Only-Many)" : "Read-Only-Many";
break;

case "ReadWriteMany":
a = r ? "RWX (Read-Write-Many)" : "Read-Write-Many";
break;

default:
a = e;
}
n.push(a);
}), _.uniq(n);
};
}).filter("middleEllipses", function() {
return function(e, t, n) {
if (t < 3) return e;
if (e.length <= t) return e;
n || (n = "...");
var a = Math.floor((t - 1) / 2);
return e.slice(0, a) + n + e.slice(e.length - a);
};
}).filter("isNil", function() {
return function(e) {
return null === e || void 0 === e;
};
}).filter("percent", function() {
return function(e, t) {
return null === e || void 0 === e ? e : _.round(100 * Number(e), t) + "%";
};
}).filter("filterCollection", function() {
return function(e, t) {
return e && t ? _.filter(e, t) : e;
};
}).filter("isIE", function() {
var e = navigator.userAgent, t = /msie|trident/i.test(e);
return function() {
return t;
};
}).filter("isEdge", function() {
var e = navigator.userAgent, t = /chrome.+? edge/i.test(e);
return function() {
return t;
};
}).filter("abs", function() {
return function(e) {
return Math.abs(e);
};
}).filter("encodeURIComponent", function() {
return window.encodeURIComponent;
}).filter("enableTechPreviewFeature", [ "Constants", function(e) {
return function(t) {
return _.get(e, [ "ENABLE_TECH_PREVIEW_FEATURE", t ], !1);
};
} ]).filter("isNonPrintable", function() {
return function(e) {
return !!e && /[\x00-\x09\x0E-\x1F]/.test(e);
};
}), angular.module("openshiftConsole").factory("logLinks", [ "$anchorScroll", "$document", "$location", "$window", function(e, t, n, a) {
var r = _.template([ "/#/discover?", "_g=(", "time:(", "from:now-1w,", "mode:relative,", "to:now", ")", ")", "&_a=(", "columns:!(kubernetes.container_name,message),", "index:'<%= index %>',", "query:(", "query_string:(", "analyze_wildcard:!t,", 'query:\'kubernetes.pod_name:"<%= podname %>" AND kubernetes.namespace_name:"<%= namespace %>"\'', ")", "),", "sort:!('@timestamp',desc)", ")", "#console_container_name=<%= containername %>", "&console_back_url=<%= backlink %>" ].join(""));
return {
scrollTop: function(e) {
e ? e.scrollTop = 0 : window.scrollTo(null, 0);
},
scrollBottom: function(e) {
e ? e.scrollTop = e.scrollHeight : window.scrollTo(0, document.documentElement.scrollHeight - document.documentElement.clientHeight);
},
chromelessLink: function(e, t) {
if (t) a.open(t, "_blank"); else {
var n = {
view: "chromeless"
};
e && e.container && (n.container = e.container), n = _.flatten([ n ]);
var r = new URI();
_.each(n, function(e) {
r.addSearch(e);
}), a.open(r.toString(), "_blank");
}
},
archiveUri: function(e, t) {
return t = t || "project." + e.namespace + "." + e.namespaceUid, e.index = t + ".*", r(e);
}
};
} ]), angular.module("javaLinkExtension", [ "openshiftConsole" ]).run([ "AuthService", "BaseHref", "DataService", "extensionRegistry", function(e, t, n, a) {
var r = [ "<div row ", 'ng-show="item.url" ', 'class="icon-row" ', 'title="Connect to container">', '<div class="icon-wrap">', '<i class="fa fa-share" aria-hidden="true"></i>', "</div>", "<div flex>", '<a ng-click="item.onClick($event)" ', 'ng-href="item.url">', "Open Java Console", "</a>", "</div>", "</div>" ].join(""), o = function(e, t, a) {
return new URI(n.url({
resource: "pods/proxy",
name: [ "https", t, a || "" ].join(":"),
namespace: e
})).segment("jolokia/");
};
a.add("container-links", _.spread(function(n, a) {
var i = _.find(n.ports || [], function(e) {
return e.name && "jolokia" === e.name.toLowerCase();
});
if (i && "Running" === _.get(a, "status.phase")) {
var s = a.status.containerStatuses, c = _.find(s, function(e) {
return e.name === n.name;
});
if (c && c.ready) {
var l = a.metadata.name, u = a.metadata.namespace, d = o(u, l, i.containerPort).toString();
return {
type: "dom",
node: r,
onClick: function(a) {
a.preventDefault(), a.stopPropagation();
var r = window.location.href, o = n.name || "Untitled Container", i = e.UserStore().getToken() || "", s = new URI().path(t).segment("java").segment("").hash(i).query({
jolokiaUrl: d,
title: o,
returnTo: r
});
window.location.href = s.toString();
},
url: d
};
}
}
}));
} ]), hawtioPluginLoader.addModule("javaLinkExtension"), angular.module("openshiftConsole").run([ "extensionRegistry", function(e) {
e.add("nav-help-dropdown", function() {
var e = [];
if (e.push({
type: "dom",
node: '<li><a target="_blank" href="{{\'default\' | helpLink}}">Documentation</a></li>'
}), !_.get(window, "OPENSHIFT_CONSTANTS.DISABLE_SERVICE_CATALOG_LANDING_PAGE")) {
var t = _.get(window, "OPENSHIFT_CONSTANTS.GUIDED_TOURS.landing_page_tour");
t && t.enabled && t.steps && e.push({
type: "dom",
node: '<li><a href="catalog?startTour=true">Tour Catalog Home</a></li>'
});
}
return e.push({
type: "dom",
node: '<li><a href="command-line">Command Line Tools</a></li>'
}), e.push({
type: "dom",
node: '<li><a href="about">About</a></li>'
}), e;
});
} ]), angular.module("openshiftConsole").run([ "extensionRegistry", "$rootScope", "DataService", "AuthService", function(e, t, n, a) {
e.add("nav-user-dropdown", function() {
var e = [];
_.get(window, "OPENSHIFT_CONSTANTS.DISABLE_COPY_LOGIN_COMMAND") || e.push({
type: "dom",
node: '<li><copy-login-to-clipboard clipboard-text="oc login ' + _.escape(n.openshiftAPIBaseUrl()) + " --token=" + _.escape(a.UserStore().getToken()) + '"></copy-login-to-clipboard></li>'
});
var r = "Log Out";
return t.user.fullName && t.user.fullName !== t.user.metadata.name && (r += " (" + t.user.metadata.name + ")"), e.push({
type: "dom",
node: '<li><a href="logout">' + _.escape(r) + "</a></li>"
}), e;
});
} ]), angular.module("openshiftConsole").run([ "extensionRegistry", "Constants", function(e, t) {
e.add("nav-dropdown-mobile", _.spread(function(e) {
var n = [], a = t.APP_LAUNCHER_NAVIGATION;
return _.each(a, function(e) {
var t = {
type: "dom",
node: [ '<li class="list-group-item">', '<a href="' + _.escape(e.href) + '">', '<span class="' + _.escape(e.iconClass) + ' fa-fw" aria-hidden="true"></span> ', '<span class="list-group-item-value">' + _.escape(e.title) + "</span>", "</a>", "</li>" ].join("")
};
n.push(t);
}), n = n.concat([ {
type: "dom",
node: [ '<li class="list-group-item">', "<a href=\"{{'default' | helpLink}}\">", '<span class="fa fa-book fa-fw" aria-hidden="true"></span> <span class="list-group-item-value">Documentation</span>', "</a>", "</li>" ].join("")
}, {
type: "dom",
node: [ '<li class="list-group-item">', '<a href="command-line">', '<span class="fa fa-terminal" aria-hidden="true"></span> <span class="list-group-item-value">Command Line Tools</span>', "</a>", "</li>" ].join("")
}, {
type: "dom",
node: [ '<li class="list-group-item">', '<a href="about">', '<span class="pficon pficon-info fa-fw" aria-hidden="true"></span> <span class="list-group-item-value">About</span>', "</a>", "</li>" ].join("")
}, {
type: "dom",
node: _.template([ '<li class="list-group-item">', '<a href="logout">', '<span class="pficon pficon-user fa-fw" aria-hidden="true"></span>', '<span class="list-group-item-value">Log out <span class="username"><%= userName %></span></span>', "</a>", "</li>" ].join(""))({
userName: e ? e.fullName || e.metadata.name : ""
})
} ]);
}));
} ]);
