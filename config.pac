function FindProxyForURL(url, host) { 
    if (isPlainHostName(host) || 
        shExpMatch(host, "*.lan")) 
        return "DIRECT";

    return "HTTP 127.0.0.1:7889";
}
