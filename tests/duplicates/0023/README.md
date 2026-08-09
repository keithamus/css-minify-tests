# Do not abstract Data-URIs to custom-properties

Data-URIs can be quite long. When the same one is used multiple times, it could
be stored in a custom-property and referenced. However, when GZipped, the
custom-property and references actually result in a larger size compared to just
letting the duplicate Data-URi's exist and be GZipped away.
