var child_process = require('child_process'),
    //grep  = spawn('grep', ['ssh']),
    read_cmd_line_args,
    cmd_line_args = {},
    config = {},
    exit_and_print_usage,
    get_keys,
    exit_and_print_usage,
    validate_cmd_line_args,
    exit_msg = '',
    INDENT="  ",
    list_method='',
    list_method_config,
    output_format_config='';
    
read_cmd_line_args = function() {
	var i=0,
		l=0,
		match='',
		r = {};
	
	for (i=0,l=process.argv.length;i<l;i++) {
		match = process.argv[i].match(/^\-\-([^=]+)=(.*)/);
		if (match) {
			if (!r.hasOwnProperty(match[1])) {
				r[match[1]] = []
			}
			r[match[1]].push(match[2]);
		}
	}
	return r;
};

config = {
	list_method: {
		'sshls': {
			cmd: "ssh -p {port} {user}@{server} 'ls -m {remote_path} 2>&1' 2>&1",
			desc: 'Lists shares from an SSH server',
			options: {
				port: { desc: 'The port to connect to.', default: '22' },
				user: { desc: 'The username to use when connecting to the SSH server.' },
				server: { desc: 'The server you want to list' },
				remote_path: { desc: 'The directory that contains directories you want to mount' }
			},
			process: function(output) {
				return output.trim().split(/,\s/);
			}
		}
	},
	output_format: {
		'fstabnfs': {
			cmd: "{server}:{remote_path}/{_output}\t{mount_point}/{_output}\tnfs4\thard,intr\t0\t1",
			desc: 'Outputs for writing an NFS line into the /etc/fstab file.',
			options: {
				server: { desc: 'The server of the NFS share' },
				remote_path: { desc: 'The full path where you will find shares beneath' },
				mount_point: { desc: 'Where to mount the share locally' },
			}
		},
		'mkdirfstabmount': {
			cmd: "sudo mkdir {mount_point}/{_output}",
			desc: 'Outputs for writing an NFS line into the /etc/fstab file.',
			options: {
				mount_point: { desc: 'Where to mount the share locally' },
			}
		},
		'writeexports': {
			cmd: "{remote_path}/{_output}\t{netmask}(rw,acl,nohide,insecure,no_subtree_check,async)",
			desc: 'Outputs for writing an NFS line into the /etc/fstab file.',
			options: {
				remote_path: { desc: 'The full path where you will find shares beneath' },
				netmask: { desc: 'The netmask you will export the filesystem to' },
			}
		},
		'writesmb': {
			cmd: "[{_output}]\n   comment={_output}\n   path={remote_path}/{_output}\n   guest ok = no\n   browseable = yes\n   create mask = 0600\n   directory mask = 0700\n",
			desc: 'Outputs for writing an SMB line into the /etc/samba/smb.conf.',
			options: {
				remote_path: { desc: 'The full path where you will find shares beneath' },
			}
		}
		
	}	
}

get_keys = function(obj) {
	var r = [],
		k = '';
	for (k in obj) {
		if (obj.hasOwnProperty(k)) {
			r.push(k);
		}
	}
	return r;
}; 

exit_and_print_usage = function(error_message) {
	var msg = "",
		sub_k='',
		get_sub_options_message;
		
	get_sub_options_message = function(sub_options) {
		var r = '',
			sub_k = '',
			op_k = '';
		for (sub_k in sub_options) {
			r = r + INDENT + sub_k+": - "+sub_options[sub_k].desc + "\n";
			for (op_k in sub_options[sub_k].options) {
				r = r + INDENT + INDENT + op_k + " - " + sub_options[sub_k].options[op_k].desc;
				if (sub_options[sub_k].options[op_k].hasOwnProperty('default')) {
					r = r + ' (default: '+sub_options[sub_k].options[op_k].default+')';
				}
				r = r + "\n";
			}
		}
		return r;
	};
	
	msg = msg + "Usage: "+process.argv[1] +
		" --list_method=[LIST_METHOD] " +
		" --output_format=[FSTAB_FORMAT]" +
		" --[OPTION]=[VALUE]\n\n" + 
		"List Methods:\n" + get_sub_options_message(config.list_method) +
		"Output Formats:\n" + get_sub_options_message(config.output_format) +
		"\n\n"+error_message;
		
	console.log(msg);
	process.exit(1);
};

validate_cmd_line_args = function(cmd_line_args) {
	
	var invalid_options = false,
		major_options = ['list_method','output_format'],
		i,
		major_option = '',
		options = {};
	
	for (i=0;i<major_options.length;i++) {
		major_option = major_options[i];
		if (!cmd_line_args.hasOwnProperty(major_option)) {
			return 'Expected '+major_option;
		}
		if (!config[major_option].hasOwnProperty(cmd_line_args[major_option]))	 {
			return 'Unrecognized '+major_option+': '+cmd_line_args[major_option];
		}
		options = config[major_option][cmd_line_args[major_option]].options;
		for (k in options) {
			if (options[k].hasOwnProperty('default')) {
				continue;
			}
			if (!cmd_line_args.hasOwnProperty(k) && options) {
				return 'Expected '+major_option+': '+k;
			}
		}
	}
	return false;
};

var str_replace = function(str,search,replace) {
	var hs = '';
	while (hs != str) {
		hs = str;
		str = str.replace(search,replace)
	}
	return str;
};

/**
 * Substitute variables into a settings set
 *
 * @param String str
 * @param Object subs
 */
var substitute = function(config,subs) {
	var k,
		r = config.cmd;
	for (k in config.options) {
		if (config.options[k].hasOwnProperty('default')) {
			subs[k] = [config.options[k].default];
		}
	}
	for (k in subs) {
		if (subs.hasOwnProperty(k) && subs[k].length) {
			r = str_replace(r,'{'+k+'}',subs[k][0],'g');
		}
	}
	return r;
}

cmd_line_args = read_cmd_line_args();

if (exit_msg = validate_cmd_line_args(cmd_line_args)) {
	exit_and_print_usage(exit_msg);
}

list_method_config = config['list_method'][cmd_line_args['list_method']];
output_format_config = config['output_format'][cmd_line_args['output_format']];

child_process.exec(
	substitute(
		list_method_config,
		cmd_line_args
	),
	{timeout:10000},
	function(error,stdout,stderr) {
		var subs = cmd_line_args,
			dirs = [];
		if (error !== null) {
			console.log(error); 
			exit(2);
		}
		output = list_method_config.process(stdout)
		for (i=0;i<output.length;i++) {
			subs['_output'] = [output[i]];
			console.log(substitute(
				output_format_config,
				subs
			));
		}
	}
);