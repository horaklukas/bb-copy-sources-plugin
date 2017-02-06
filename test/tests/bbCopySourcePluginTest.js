var path = require('path');
var chai = require('chai');
var sinonChai = require('sinon-chai');
var sinon = require('sinon');
var mockery = require('mockery');

var expect = chai.expect;
chai.use(sinonChai);

describe('BB copy sources plugin', function() {
	var bbCopySourcesPlugin,
		enabled,
		logger;
	var mock = {
		bb: {
			getProject: sinon.stub()
		},
		ncp: {
			ncp: sinon.spy()
		},
		fs: {
			readFileSync: sinon.stub(),
			existsSync: sinon.stub(),
			lstatSync: sinon.stub()
		}
	};

	before(function() {
		mockery.registerAllowables([
			'child_process', 'expect', 'sinon', 'path',
			'../../dist'
		]);
		mockery.registerMock('bobril-build', mock.bb);
		mockery.registerMock('ncp', mock.ncp);
		mockery.registerMock('fs', mock.fs);
		mockery.enable({
			useCleanCache: true,
			warnOnUnregistered: false
		});
	});

	beforeEach(function () {
		// needed to allow repeat call of `plugin.init` since it's called just on first call
		mockery.resetCache();

		bbCopySourcesPlugin = require('../../dist');
		enabled = require('../../dist/enabled');
		logger = require('../../dist/logger');

		sinon.spy(enabled, 'isEnabled');
		sinon.stub(logger, 'log');
	});

	it('should do nothing if there are compile errors', function() {
		bbCopySourcesPlugin.afterInteractiveCompile({errors: 2});

		expect(enabled.isEnabled).not.to.have.been.called;
		expect(mock.ncp.ncp).not.to.have.been.called;
	});

	it('should copy nothing if config for plugin not available', function () {
		mock.bb.getProject.returns({
			pluginsConfig: { 'bb-other-plugin': 'neco'}
		});

		bbCopySourcesPlugin.afterInteractiveCompile({errors: 0});

		expect(enabled.isEnabled).to.have.been.called;
		expect(logger.log).not.to.have.been.called;
		expect(mock.ncp.ncp).not.to.have.been.called;
	});

	it('should fail log error if copyFile field is not available', function () {
		mock.bb.getProject.returns({
			pluginsConfig: { 'bb-copy-sources-plugin': {
				wrongField: 'content'
			}},
			dir: 'project/dir'
		});

		bbCopySourcesPlugin.afterInteractiveCompile({errors: 0});

		expect(logger.log).to.have.been.calledOnce.and.calledWith('plugin configuration requires "copyFile" field to be specified.');
		expect(mock.ncp.ncp).not.to.have.been.called;
	});

	it('should fail when copy file does not exist', function () {
		var copyFilePath = '/path/to/copy/file';

		mock.fs.existsSync.withArgs(copyFilePath).returns(false);
		mock.bb.getProject.returns({
			pluginsConfig: { 'bb-copy-sources-plugin': {
				copyFile: copyFilePath
			}},
			dir: 'project/dir'
		});

		bbCopySourcesPlugin.afterInteractiveCompile({errors: 0});

		expect(logger.log).to.have.been.calledOnce.and.calledWith('.copy file not found at path ' + copyFilePath + ', no sources copied.');
		expect(mock.ncp.ncp).not.to.have.been.called;
	});

	it('should fail when destination does not exist', function () {
		var copyFilePath = 'fake/copy/file/path',
			destination = '/destination/path',
			projectDir = 'project/dir',
			destResolved  = path.resolve(projectDir, destination);

		mock.fs.existsSync.withArgs(copyFilePath).returns(true);
		mock.fs.readFileSync.withArgs(copyFilePath).returns(new Buffer(destination, 'binary'));
		mock.fs.existsSync.withArgs(destResolved).returns(false);
		mock.fs.lstatSync.returns({isDirectory: function() { return true; }});
		mock.bb.getProject.returns({
			pluginsConfig: { 'bb-copy-sources-plugin': {
				'copyFile': copyFilePath
			}},
			dir: projectDir
		});

		bbCopySourcesPlugin.afterInteractiveCompile({errors: 0});

		expect(logger.log).to.have.been.calledOnce.and.calledWith('destination ' + destination + ' (resolved to ' +
			destResolved + ') does not exist or is not a directory');
		expect(mock.ncp.ncp).not.to.have.been.called;
	});

	it('should fail when destination is not a directory', function () {
		var copyFilePath = 'fake/copy/file/path',
			destination = '/destination/path',
			projectDir = 'project/dir',
			destResolved  = path.resolve(projectDir, destination);

		mock.fs.existsSync.withArgs(copyFilePath).returns(true);
		mock.fs.readFileSync.withArgs(copyFilePath).returns(new Buffer(destination, 'binary'));
		mock.fs.existsSync.withArgs(destResolved).returns(true);
		mock.fs.lstatSync.withArgs(destResolved).returns({isDirectory: function() { return false; }});
		mock.bb.getProject.returns({
			pluginsConfig: { 'bb-copy-sources-plugin': {
				'copyFile': copyFilePath
			}},
			dir: projectDir
		});

		bbCopySourcesPlugin.afterInteractiveCompile({errors: 0});

		expect(logger.log).to.have.been.calledOnce.and.calledWith('destination ' + destination + ' (resolved to ' +
			destResolved + ') does not exist or is not a directory');
		expect(mock.ncp.ncp).not.to.have.been.called;
	});

	it('should copy source files', function () {
		var copyFilePath = 'fake/copy/file/path',
			destination = '/destination/path',
			projectDir = 'project/dir',
			srcResolved  = path.resolve(projectDir, 'src'),
			destResolved  = path.resolve(projectDir, destination);

		mock.fs.existsSync.withArgs(copyFilePath).returns(true);
		mock.fs.readFileSync.withArgs(copyFilePath).returns(new Buffer(destination, 'binary'));
		mock.fs.existsSync.withArgs(destResolved).returns(true);
		mock.fs.lstatSync.withArgs(destResolved).returns({isDirectory: function() { return true; }});
		mock.bb.getProject.returns({
			pluginsConfig: { 'bb-copy-sources-plugin': {
				'copyFile': copyFilePath
			}},
			dir: projectDir
		});

		bbCopySourcesPlugin.afterInteractiveCompile({errors: 0});

		expect(mock.ncp.ncp).to.have.been.called.and.calledWith(srcResolved, path.resolve(destResolved, 'src'));
		expect(logger.log).to.have.been.called.and.calledWith('Copying all from ' + srcResolved +  ' to ' + destResolved + '');
	});

	after(function() {
		mockery.deregisterMock('bobril-build');
		mockery.deregisterMock('ncp');
	});
});